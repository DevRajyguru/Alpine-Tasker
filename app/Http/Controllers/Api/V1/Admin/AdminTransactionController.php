<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminTransactionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        $query = Payment::query()
            ->with([
                'task:id,title,status',
                'customer:id,name,email',
                'tasker:id,name,email',
                'coupon:id,code',
                'payout:id,payment_id,amount,status,scheduled_for,paid_at',
            ])
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }
        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        $summaryQuery = Payment::query();
        if ($request->filled('status')) {
            $summaryQuery->where('status', $request->query('status'));
        }
        if ($dateFrom) {
            $summaryQuery->whereDate('created_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $summaryQuery->whereDate('created_at', '<=', $dateTo);
        }

        $capturedSummaryQuery = Payment::query()->where('status', 'captured');
        if ($request->filled('status') && $request->query('status') !== 'captured') {
            $capturedSummaryQuery->whereRaw('1 = 0');
        }
        if ($dateFrom) {
            $capturedSummaryQuery->whereDate('created_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $capturedSummaryQuery->whereDate('created_at', '<=', $dateTo);
        }

        return response()->json([
            'transactions' => $query->paginate(20),
            'summary' => [
                'total_transactions' => (int) $summaryQuery->count(),
                'total_captured_volume' => (float) $capturedSummaryQuery->sum('captured_amount'),
                'total_commission_earned' => (float) $capturedSummaryQuery->sum('commission_amount'),
                'total_gateway_fees' => (float) $capturedSummaryQuery->sum('gateway_fee'),
            ],
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'status' => $request->query('status'),
            ],
        ]);
    }
}
