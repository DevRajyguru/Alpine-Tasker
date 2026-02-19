<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminCouponStoreRequest;
use App\Http\Requests\AdminCouponUpdateRequest;
use App\Models\Coupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminCouponController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Coupon::query()->latest();

        if ($request->filled('code')) {
            $query->where('code', 'like', '%'.strtoupper((string) $request->query('code')).'%');
        }

        if ($request->filled('type')) {
            $query->where('type', (string) $request->query('type'));
        }

        if ($request->filled('is_active')) {
            $active = filter_var($request->query('is_active'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($active !== null) {
                $query->where('is_active', $active);
            }
        }

        $perPage = max(1, min(100, (int) $request->query('per_page', 20)));

        return response()->json([
            'coupons' => $query->paginate($perPage),
        ]);
    }

    public function store(AdminCouponStoreRequest $request): JsonResponse
    {
        $coupon = Coupon::create(array_merge(
            $request->validated(),
            [
                'code' => strtoupper((string) $request->validated('code')),
                'created_by' => $request->user()->id,
            ]
        ));

        return response()->json([
            'message' => 'Coupon created.',
            'coupon' => $coupon,
        ], 201);
    }

    public function show(Coupon $coupon): JsonResponse
    {
        return response()->json(['coupon' => $coupon]);
    }

    public function update(AdminCouponUpdateRequest $request, Coupon $coupon): JsonResponse
    {
        $payload = $request->validated();
        if (isset($payload['code'])) {
            $payload['code'] = strtoupper((string) $payload['code']);
        }
        $coupon->update($payload);

        return response()->json([
            'message' => 'Coupon updated.',
            'coupon' => $coupon->fresh(),
        ]);
    }

    public function destroy(Coupon $coupon): JsonResponse
    {
        $coupon->delete();

        return response()->json(['message' => 'Coupon deleted.']);
    }
}
