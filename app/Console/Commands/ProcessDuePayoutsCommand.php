<?php

namespace App\Console\Commands;

use App\Models\Payout;
use App\Models\TaskerProfile;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class ProcessDuePayoutsCommand extends Command
{
    protected $signature = 'payouts:process-due';

    protected $description = 'Mark due pending payouts as paid';

    public function handle(): int
    {
        $due = Payout::query()
            ->where('status', 'pending')
            ->whereNotNull('scheduled_for')
            ->where('scheduled_for', '<=', now())
            ->get();

        foreach ($due as $payout) {
            $profile = TaskerProfile::where('user_id', $payout->tasker_id)->first();
            if (! $profile || ! $profile->stripe_account_id) {
                $payout->update([
                    'status' => 'failed',
                ]);
                continue;
            }

            $result = $this->createStripeTransfer(
                destinationAccountId: (string) $profile->stripe_account_id,
                amountInMinor: (int) round((float) $payout->amount * 100),
                currency: 'usd',
                paymentId: (int) $payout->payment_id
            );

            if (! $result['success']) {
                $payout->update([
                    'status' => 'failed',
                ]);
                continue;
            }

            $payout->update([
                'gateway_payout_id' => $result['id'],
                'status' => 'paid',
                'paid_at' => now(),
            ]);
        }

        $this->info("Processed {$due->count()} payout(s).");

        return self::SUCCESS;
    }

    private function createStripeTransfer(string $destinationAccountId, int $amountInMinor, string $currency, int $paymentId): array
    {
        $secret = (string) config('services.stripe.secret');
        if ($secret === '') {
            return [
                'success' => true,
                'id' => 'tr_mock_'.uniqid(),
                'details' => null,
            ];
        }

        $response = Http::asForm()
            ->withToken($secret)
            ->post('https://api.stripe.com/v1/transfers', [
                'amount' => $amountInMinor,
                'currency' => $currency,
                'destination' => $destinationAccountId,
                'description' => "Task payout for payment #{$paymentId}",
                'metadata[payment_id]' => (string) $paymentId,
            ]);

        if (! $response->successful()) {
            return [
                'success' => false,
                'id' => null,
                'details' => $response->json(),
            ];
        }

        return [
            'success' => true,
            'id' => (string) data_get($response->json(), 'id'),
            'details' => $response->json(),
        ];
    }
}
