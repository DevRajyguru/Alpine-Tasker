<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CouponValidateRequest;
use App\Models\Coupon;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class CouponController extends Controller
{
    public function validateCoupon(CouponValidateRequest $request): JsonResponse
    {
        $coupon = Coupon::where('code', strtoupper($request->validated('code')))->first();
        if (! $coupon) {
            return response()->json(['message' => 'Invalid coupon.'], 422);
        }

        $taskAmount = (float) $request->validated('task_amount');
        $validation = $this->validateAgainstRules($coupon, $taskAmount);

        if (! $validation['valid']) {
            return response()->json(['message' => $validation['message']], 422);
        }

        return response()->json([
            'message' => 'Coupon is valid.',
            'coupon' => $coupon,
            'discount_amount' => $validation['discount_amount'],
            'payable_amount' => round(max(0, $taskAmount - $validation['discount_amount']), 2),
        ]);
    }

    private function validateAgainstRules(Coupon $coupon, float $taskAmount): array
    {
        if (! $coupon->is_active) {
            return ['valid' => false, 'message' => 'Coupon is inactive.', 'discount_amount' => 0];
        }

        $now = Carbon::now();
        if ($coupon->starts_at && $now->lt($coupon->starts_at)) {
            return ['valid' => false, 'message' => 'Coupon has not started yet.', 'discount_amount' => 0];
        }
        if ($coupon->expires_at && $now->gt($coupon->expires_at)) {
            return ['valid' => false, 'message' => 'Coupon has expired.', 'discount_amount' => 0];
        }
        if ($coupon->usage_limit !== null && $coupon->used_count >= $coupon->usage_limit) {
            return ['valid' => false, 'message' => 'Coupon usage limit reached.', 'discount_amount' => 0];
        }
        if ($coupon->min_order_amount !== null && $taskAmount < (float) $coupon->min_order_amount) {
            return ['valid' => false, 'message' => 'Minimum order amount not met.', 'discount_amount' => 0];
        }

        $discount = $coupon->type === 'percent'
            ? ($taskAmount * ((float) $coupon->value / 100))
            : (float) $coupon->value;

        if ($coupon->max_discount !== null) {
            $discount = min($discount, (float) $coupon->max_discount);
        }

        $discount = round(max(0, min($discount, $taskAmount)), 2);

        return ['valid' => true, 'message' => 'Valid coupon.', 'discount_amount' => $discount];
    }
}

