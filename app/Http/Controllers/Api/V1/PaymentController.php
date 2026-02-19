<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentRefundRequest;
use App\Http\Requests\PaymentAuthorizeRequest;
use App\Models\CommissionSetting;
use App\Models\Coupon;
use App\Models\CouponRedemption;
use App\Models\Dispute;
use App\Models\Payment;
use App\Models\Payout;
use App\Models\Refund;
use App\Models\Task;
use App\Models\TaskerProfile;
use App\Models\TaskStatusHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class PaymentController extends Controller
{
    public function authorizePayment(PaymentAuthorizeRequest $request, Task $task): JsonResponse
    {
        $user = $request->user();
        if ($task->customer_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        if (! in_array($task->status, ['open', 'assigned'], true)) {
            return response()->json(['message' => 'Payment cannot be authorized in current task status.'], 422);
        }

        $taskAmount = (float) $request->validated('task_amount');
        $coupon = null;
        $discount = 0.0;

        if ($request->filled('coupon_code')) {
            $coupon = Coupon::where('code', strtoupper((string) $request->validated('coupon_code')))->first();
            if (! $coupon) {
                return response()->json(['message' => 'Invalid coupon.'], 422);
            }

            [$valid, $message, $discount] = $this->resolveDiscount($coupon, $taskAmount);
            if (! $valid) {
                return response()->json(['message' => $message], 422);
            }
        }

        $payable = round(max(0, $taskAmount - $discount), 2);
        $authorized = round($payable * (1 + ($this->preAuthExtraPercent() / 100)), 2);
        $commission = $this->calculateCommission($payable);
        $gatewayFee = round($payable * 0.029 + 0.30, 2);
        $taskerNet = round(max(0, $payable - $commission - $gatewayFee), 2);

        if ($this->isStripeLiveMode() && ! $request->filled('payment_method_id')) {
            return response()->json([
                'message' => 'payment_method_id is required for Stripe card/Apple Pay authorization.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $gatewayPaymentId = $this->createGatewayAuthorization(
            amountInMinor: (int) round($authorized * 100),
            currency: strtolower((string) $request->validated('currency', 'USD')),
            paymentMethodId: $request->validated('payment_method_id'),
            metadata: [
                'task_id' => (string) $task->id,
                'customer_id' => (string) $user->id,
                'tasker_id' => (string) ($task->selected_tasker_id ?? ''),
            ]
        );

        if (! $gatewayPaymentId['success']) {
            return response()->json([
                'message' => $gatewayPaymentId['message'],
                'details' => $gatewayPaymentId['details'],
            ], 422);
        }

        $payment = DB::transaction(function () use (
            $task,
            $user,
            $request,
            $coupon,
            $discount,
            $taskAmount,
            $authorized,
            $payable,
            $commission,
            $gatewayFee,
            $taskerNet,
            $gatewayPaymentId
        ) {
            $record = Payment::updateOrCreate(
                ['task_id' => $task->id],
                [
                    'customer_id' => $user->id,
                    'tasker_id' => $task->selected_tasker_id,
                    'gateway' => 'stripe',
                    'gateway_payment_id' => $gatewayPaymentId['id'],
                    'currency' => strtoupper((string) $request->validated('currency', 'USD')),
                    'task_amount' => $taskAmount,
                    'authorized_amount' => $authorized,
                    'captured_amount' => 0,
                    'coupon_id' => $coupon?->id,
                    'discount_amount' => $discount,
                    'commission_amount' => $commission,
                    'gateway_fee' => $gatewayFee,
                    'tasker_net_amount' => $taskerNet,
                    'status' => 'authorized',
                    'authorized_at' => now(),
                ]
            );

            if ($coupon) {
                CouponRedemption::updateOrCreate(
                    ['payment_id' => $record->id],
                    [
                        'coupon_id' => $coupon->id,
                        'customer_id' => $user->id,
                        'discount_amount' => $discount,
                    ]
                );
            }

            return $record;
        });

        return response()->json([
            'message' => 'Payment authorized (hold created).',
            'payment' => $payment,
            'payable_amount' => $payable,
            'preauth_extra_percent' => $this->preAuthExtraPercent(),
            'authorized_hold_amount' => $authorized,
            'gateway_client_secret' => $gatewayPaymentId['client_secret'] ?? null,
            'supported_methods' => ['card', 'apple_pay'],
        ]);
    }

    public function capture(Request $request, Payment $payment): JsonResponse
    {
        $user = $request->user();
        if ($payment->customer_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        if ($payment->status !== 'authorized') {
            return response()->json(['message' => 'Only authorized payments can be captured.'], 422);
        }

        $payment->loadMissing('task.assignment');
        if (! $payment->task || ! in_array($payment->task->status, ['completed', 'closed'], true)) {
            return response()->json(['message' => 'Payment release is allowed only after task completion.'], 422);
        }

        $hasOpenDispute = Dispute::query()
            ->where('task_id', $payment->task_id)
            ->whereIn('status', ['open', 'in_review'])
            ->exists();
        if ($hasOpenDispute) {
            return response()->json(['message' => 'Cannot capture payment while dispute is open/in review.'], 422);
        }

        if (! $payment->task->assignment || ! $payment->task->assignment->actual_cost_approved_by_customer) {
            return response()->json(['message' => 'Customer-approved actual cost is required before capture.'], 422);
        }

        $approvedActual = (float) ($payment->task->assignment->actual_cost ?? $payment->task_amount);
        $discount = round(min((float) $payment->discount_amount, $approvedActual), 2);
        $capturedAmount = round(max(0, $approvedActual - $discount), 2);

        if ($capturedAmount > (float) $payment->authorized_amount) {
            return response()->json([
                'message' => 'Approved actual cost exceeds held amount. Re-authorization is required.',
            ], 422);
        }

        $commission = $this->calculateCommission($capturedAmount);
        $gatewayFee = round($capturedAmount * 0.029 + 0.30, 2);
        $taskerNet = round(max(0, $capturedAmount - $commission - $gatewayFee), 2);

        $taskerProfile = TaskerProfile::where('user_id', $payment->tasker_id)->first();
        if (! $taskerProfile || ! $taskerProfile->stripe_account_id) {
            return response()->json([
                'message' => 'Tasker Stripe Connect account is not linked for payout.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (! str_starts_with((string) $payment->gateway_payment_id, 'pi_mock_')) {
            $captureResult = $this->captureGatewayPayment((string) $payment->gateway_payment_id);
            if (! $captureResult['success']) {
                return response()->json([
                    'message' => $captureResult['message'],
                    'details' => $captureResult['details'],
                ], 422);
            }
        }

        DB::transaction(function () use ($payment, $user, $capturedAmount, $discount, $commission, $gatewayFee, $taskerNet): void {
            $payment->update([
                'task_amount' => $capturedAmount + $discount,
                'captured_amount' => $capturedAmount,
                'discount_amount' => $discount,
                'commission_amount' => $commission,
                'gateway_fee' => $gatewayFee,
                'tasker_net_amount' => $taskerNet,
                'status' => 'captured',
                'captured_at' => now(),
            ]);

            Payout::updateOrCreate(
                ['payment_id' => $payment->id],
                [
                    'tasker_id' => $payment->tasker_id,
                    'amount' => $payment->tasker_net_amount,
                    'status' => 'pending',
                    'scheduled_for' => now()->addWeekdays($this->payoutDelayBusinessDays()),
                    'paid_at' => null,
                ]
            );

            $this->closeTaskOnRelease($payment->task, $user->id);
        });

        return response()->json([
            'message' => 'Payment captured. Commission and fees deducted. Tasker payout scheduled.',
            'payment' => $payment->fresh('payout'),
        ]);
    }

    public function payAfterService(PaymentAuthorizeRequest $request, Task $task): JsonResponse
    {
        $user = $request->user();
        if ($task->customer_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        if (! in_array($task->status, ['completed', 'closed'], true)) {
            return response()->json(['message' => 'Pay after service is allowed only after completion.'], 422);
        }

        $assignment = $task->assignment;
        if (! $assignment || $assignment->payment_option !== 'pay_after_service') {
            return response()->json(['message' => 'This task is not configured for pay after service.'], 422);
        }

        $taskAmount = (float) $request->validated('task_amount');
        $coupon = null;
        $discount = 0.0;

        if ($request->filled('coupon_code')) {
            $coupon = Coupon::where('code', strtoupper((string) $request->validated('coupon_code')))->first();
            if (! $coupon) {
                return response()->json(['message' => 'Invalid coupon.'], 422);
            }
            [$valid, $message, $discount] = $this->resolveDiscount($coupon, $taskAmount);
            if (! $valid) {
                return response()->json(['message' => $message], 422);
            }
        }

        $payable = round(max(0, $taskAmount - $discount), 2);
        $commission = $this->calculateCommission($payable);
        $gatewayFee = round($payable * 0.029 + 0.30, 2);
        $taskerNet = round(max(0, $payable - $commission - $gatewayFee), 2);

        if ($this->isStripeLiveMode() && ! $request->filled('payment_method_id')) {
            return response()->json([
                'message' => 'payment_method_id is required for Stripe card/Apple Pay capture.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $gatewayPaymentId = $this->createGatewayAuthorization(
            amountInMinor: (int) round($payable * 100),
            currency: strtolower((string) $request->validated('currency', 'USD')),
            paymentMethodId: $request->validated('payment_method_id'),
            metadata: [
                'task_id' => (string) $task->id,
                'customer_id' => (string) $user->id,
                'tasker_id' => (string) ($task->selected_tasker_id ?? ''),
            ]
        );

        if (! $gatewayPaymentId['success']) {
            return response()->json([
                'message' => $gatewayPaymentId['message'],
                'details' => $gatewayPaymentId['details'],
            ], 422);
        }

        $payment = DB::transaction(function () use (
            $task,
            $user,
            $request,
            $coupon,
            $discount,
            $taskAmount,
            $payable,
            $commission,
            $gatewayFee,
            $taskerNet,
            $gatewayPaymentId
        ) {
            $record = Payment::updateOrCreate(
                ['task_id' => $task->id],
                [
                    'customer_id' => $user->id,
                    'tasker_id' => $task->selected_tasker_id,
                    'gateway' => 'stripe',
                    'gateway_payment_id' => $gatewayPaymentId['id'],
                    'currency' => strtoupper((string) $request->validated('currency', 'USD')),
                    'task_amount' => $taskAmount,
                    'authorized_amount' => $payable,
                    'captured_amount' => $payable,
                    'coupon_id' => $coupon?->id,
                    'discount_amount' => $discount,
                    'commission_amount' => $commission,
                    'gateway_fee' => $gatewayFee,
                    'tasker_net_amount' => $taskerNet,
                    'status' => 'captured',
                    'authorized_at' => now(),
                    'captured_at' => now(),
                ]
            );

            if ($coupon) {
                CouponRedemption::updateOrCreate(
                    ['payment_id' => $record->id],
                    [
                        'coupon_id' => $coupon->id,
                        'customer_id' => $user->id,
                        'discount_amount' => $discount,
                    ]
                );
            }

            Payout::updateOrCreate(
                ['payment_id' => $record->id],
                [
                    'tasker_id' => $record->tasker_id,
                    'amount' => $record->tasker_net_amount,
                    'status' => 'pending',
                    'scheduled_for' => now()->addWeekdays($this->payoutDelayBusinessDays()),
                    'paid_at' => null,
                ]
            );

            $this->closeTaskOnRelease($task, $user->id);

            return $record;
        });

        return response()->json([
            'message' => 'Pay after service captured. Commission and fees deducted. Tasker payout scheduled.',
            'payment' => $payment->fresh('payout'),
        ]);
    }

    public function refund(PaymentRefundRequest $request, Payment $payment): JsonResponse
    {
        $user = $request->user();
        if ($payment->customer_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        if ($payment->status !== 'captured') {
            return response()->json(['message' => 'Only captured payments can be refunded.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $amount = round((float) ($request->validated('amount') ?? $payment->captured_amount), 2);
        if ($amount <= 0 || $amount > (float) $payment->captured_amount) {
            return response()->json(['message' => 'Invalid refund amount.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $reason = (string) ($request->validated('reason') ?? 'Customer requested refund');

        $gateway = $this->createGatewayRefund(
            paymentIntentId: (string) $payment->gateway_payment_id,
            amountInMinor: (int) round($amount * 100),
            reason: $reason
        );

        if (! $gateway['success']) {
            return response()->json([
                'message' => $gateway['message'],
                'details' => $gateway['details'],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $refund = DB::transaction(function () use ($payment, $user, $amount, $reason, $gateway) {
            $record = Refund::create([
                'payment_id' => $payment->id,
                'requested_by' => $user->id,
                'amount' => $amount,
                'reason' => $reason,
                'gateway_refund_id' => $gateway['id'],
                'status' => 'processed',
                'processed_at' => now(),
            ]);

            $payment->update([
                'status' => $amount >= (float) $payment->captured_amount ? 'refunded' : 'partially_refunded',
            ]);

            return $record;
        });

        return response()->json([
            'message' => 'Refund processed successfully.',
            'refund' => $refund,
            'payment' => $payment->fresh(),
        ]);
    }

    public function webhook(Request $request): JsonResponse
    {
        $secret = (string) config('services.stripe.webhook_secret');
        if ($secret !== '') {
            $sig = (string) $request->header('Stripe-Signature', '');
            $timestamp = null;
            $signature = null;
            foreach (explode(',', $sig) as $chunk) {
                [$k, $v] = array_pad(explode('=', $chunk, 2), 2, null);
                if ($k === 't') {
                    $timestamp = $v;
                }
                if ($k === 'v1') {
                    $signature = $v;
                }
            }

            if (! $timestamp || ! $signature) {
                return response()->json(['message' => 'Invalid Stripe signature header.'], Response::HTTP_BAD_REQUEST);
            }

            $payload = $request->getContent();
            $expected = hash_hmac('sha256', "{$timestamp}.{$payload}", $secret);
            if (! hash_equals($expected, $signature)) {
                return response()->json(['message' => 'Invalid Stripe signature.'], Response::HTTP_BAD_REQUEST);
            }
        }

        $event = $request->json()->all();
        $type = (string) data_get($event, 'type');
        $object = data_get($event, 'data.object', []);

        if ($type === 'payment_intent.canceled') {
            $paymentIntentId = (string) data_get($object, 'id');
            Payment::where('gateway_payment_id', $paymentIntentId)->update(['status' => 'voided']);
        }

        if (in_array($type, ['charge.refunded', 'refund.updated'], true)) {
            $refundId = (string) (data_get($object, 'id') ?: data_get($object, 'refunds.data.0.id'));
            if ($refundId !== '') {
                Refund::where('gateway_refund_id', $refundId)->update([
                    'status' => 'processed',
                    'processed_at' => now(),
                ]);
            }
        }

        if ($type === 'account.updated') {
            $accountId = (string) data_get($object, 'id');
            if ($accountId !== '') {
                TaskerProfile::where('stripe_account_id', $accountId)->update([
                    'stripe_charges_enabled' => (bool) data_get($object, 'charges_enabled', false),
                    'stripe_payouts_enabled' => (bool) data_get($object, 'payouts_enabled', false),
                    'stripe_onboarded_at' => ((bool) data_get($object, 'charges_enabled', false) && (bool) data_get($object, 'payouts_enabled', false)) ? now() : null,
                ]);
            }
        }

        return response()->json(['received' => true]);
    }

    private function resolveDiscount(Coupon $coupon, float $taskAmount): array
    {
        if (! $coupon->is_active) {
            return [false, 'Coupon is inactive.', 0];
        }
        if ($coupon->starts_at && now()->lt($coupon->starts_at)) {
            return [false, 'Coupon has not started yet.', 0];
        }
        if ($coupon->expires_at && now()->gt($coupon->expires_at)) {
            return [false, 'Coupon has expired.', 0];
        }
        if ($coupon->usage_limit !== null && $coupon->used_count >= $coupon->usage_limit) {
            return [false, 'Coupon usage limit reached.', 0];
        }
        if ($coupon->min_order_amount !== null && $taskAmount < (float) $coupon->min_order_amount) {
            return [false, 'Minimum order amount not met.', 0];
        }

        $discount = $coupon->type === 'percent'
            ? ($taskAmount * ((float) $coupon->value / 100))
            : (float) $coupon->value;

        if ($coupon->max_discount !== null) {
            $discount = min($discount, (float) $coupon->max_discount);
        }

        return [true, 'OK', round(max(0, min($discount, $taskAmount)), 2)];
    }

    private function calculateCommission(float $amount): float
    {
        $active = CommissionSetting::where('is_active', true)->latest('id')->first();
        if (! $active) {
            return round($amount * 0.10, 2);
        }

        if ($active->commission_type === 'fixed') {
            return round((float) $active->commission_value, 2);
        }

        return round($amount * (((float) $active->commission_value) / 100), 2);
    }

    private function createGatewayAuthorization(int $amountInMinor, string $currency, ?string $paymentMethodId = null, array $metadata = []): array
    {
        $secret = (string) config('services.stripe.secret');
        if ($secret === '') {
            return [
                'success' => true,
                'id' => 'pi_mock_'.uniqid(),
                'message' => 'Stripe key missing, using mock payment intent.',
                'details' => null,
                'client_secret' => null,
            ];
        }

        $payload = [
            'amount' => $amountInMinor,
            'currency' => $currency,
            'capture_method' => 'manual',
            'automatic_payment_methods[enabled]' => 'true',
        ];

        if ($paymentMethodId) {
            $payload['payment_method'] = $paymentMethodId;
            $payload['confirm'] = 'true';
            $payload['off_session'] = 'true';
        }

        foreach ($metadata as $k => $v) {
            $payload["metadata[{$k}]"] = (string) $v;
        }

        $response = Http::asForm()
            ->withToken($secret)
            ->post('https://api.stripe.com/v1/payment_intents', $payload);

        if (! $response->successful()) {
            return [
                'success' => false,
                'id' => null,
                'message' => 'Stripe payment intent creation failed.',
                'details' => $response->json(),
                'client_secret' => null,
            ];
        }

        if ($paymentMethodId && data_get($response->json(), 'status') !== 'requires_capture') {
            return [
                'success' => false,
                'id' => (string) data_get($response->json(), 'id'),
                'message' => 'Stripe authorization did not reach requires_capture state.',
                'details' => $response->json(),
                'client_secret' => (string) data_get($response->json(), 'client_secret'),
            ];
        }

        return [
            'success' => true,
            'id' => (string) data_get($response->json(), 'id'),
            'message' => 'Stripe payment intent created.',
            'details' => $response->json(),
            'client_secret' => (string) data_get($response->json(), 'client_secret'),
        ];
    }

    private function isStripeLiveMode(): bool
    {
        return (string) config('services.stripe.secret') !== '';
    }

    private function captureGatewayPayment(string $paymentIntentId): array
    {
        $secret = (string) config('services.stripe.secret');
        if ($secret === '') {
            return [
                'success' => true,
                'message' => 'Stripe key missing, skipped capture in mock mode.',
                'details' => null,
            ];
        }

        $response = Http::asForm()
            ->withToken($secret)
            ->post("https://api.stripe.com/v1/payment_intents/{$paymentIntentId}/capture");

        if (! $response->successful()) {
            return [
                'success' => false,
                'message' => 'Stripe capture failed.',
                'details' => $response->json(),
            ];
        }

        return [
            'success' => true,
            'message' => 'Stripe capture successful.',
            'details' => $response->json(),
        ];
    }

    private function createGatewayRefund(string $paymentIntentId, int $amountInMinor, string $reason): array
    {
        $secret = (string) config('services.stripe.secret');
        if ($secret === '') {
            return [
                'success' => true,
                'id' => 're_mock_'.uniqid(),
                'message' => 'Stripe key missing, using mock refund.',
                'details' => null,
            ];
        }

        $response = Http::asForm()
            ->withToken($secret)
            ->post('https://api.stripe.com/v1/refunds', [
                'payment_intent' => $paymentIntentId,
                'amount' => $amountInMinor,
                'reason' => 'requested_by_customer',
                'metadata[app_reason]' => $reason,
            ]);

        if (! $response->successful()) {
            return [
                'success' => false,
                'id' => null,
                'message' => 'Stripe refund failed.',
                'details' => $response->json(),
            ];
        }

        return [
            'success' => true,
            'id' => (string) data_get($response->json(), 'id'),
            'message' => 'Stripe refund successful.',
            'details' => $response->json(),
        ];
    }

    private function closeTaskOnRelease(Task $task, int $changedBy): void
    {
        $task->refresh();
        if ($task->status === 'closed') {
            return;
        }

        $from = $task->status;
        $task->update(['status' => 'closed']);

        if ($task->assignment) {
            $task->assignment->update([
                'closed_at' => now(),
            ]);
        }

        TaskStatusHistory::create([
            'task_id' => $task->id,
            'from_status' => $from,
            'to_status' => 'closed',
            'changed_by' => $changedBy,
            'note' => 'Payment captured. Commission and fees deducted. Task closed.',
        ]);
    }

    private function preAuthExtraPercent(): float
    {
        $value = (float) env('PAYMENT_PREAUTH_EXTRA_PERCENT', 30);
        return max(20, min(50, $value));
    }

    private function payoutDelayBusinessDays(): int
    {
        $days = (int) env('PAYOUT_DELAY_BUSINESS_DAYS', 3);
        return max(2, min(5, $days));
    }
}
