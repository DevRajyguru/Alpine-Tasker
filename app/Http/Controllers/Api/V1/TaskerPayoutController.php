<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Payout;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TaskerPayoutController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'tasker') {
            return response()->json(['message' => 'Only taskers can access payouts.'], Response::HTTP_FORBIDDEN);
        }

        $payouts = Payout::query()
            ->where('tasker_id', $user->id)
            ->with(['payment.task:id,title,status'])
            ->latest()
            ->paginate(20);

        return response()->json([
            'payouts' => $payouts,
        ]);
    }
}

