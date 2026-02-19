<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommissionSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommissionController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'commissions' => CommissionSetting::latest()->paginate(20),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'commission_type' => ['required', 'in:percent,fixed'],
            'commission_value' => ['required', 'numeric', 'min:0'],
            'effective_from' => ['nullable', 'date'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if (($payload['is_active'] ?? true) === true) {
            CommissionSetting::where('is_active', true)->update(['is_active' => false]);
        }

        $setting = CommissionSetting::create([
            'commission_type' => $payload['commission_type'],
            'commission_value' => $payload['commission_value'],
            'effective_from' => $payload['effective_from'] ?? now(),
            'is_active' => $payload['is_active'] ?? true,
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Commission setting saved.',
            'commission' => $setting,
        ], 201);
    }
}

