<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TaskActualCostController extends Controller
{
    public function submit(Request $request, Task $task): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'tasker' || $task->selected_tasker_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        if (! in_array($task->status, ['assigned', 'in_progress', 'completed'], true)) {
            return response()->json(['message' => 'Actual cost can be submitted only after assignment.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $payload = $request->validate([
            'actual_cost' => ['required', 'numeric', 'min:1'],
            'note' => ['nullable', 'string'],
        ]);

        if (! $task->assignment) {
            return response()->json(['message' => 'Task assignment not found.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $task->assignment->update([
            'actual_cost' => (float) $payload['actual_cost'],
            'actual_cost_note' => $payload['note'] ?? null,
            'actual_cost_submitted_at' => now(),
            'actual_cost_approved_at' => null,
            'actual_cost_approved_by_customer' => false,
        ]);

        return response()->json([
            'message' => 'Actual cost submitted. Awaiting customer approval.',
            'assignment' => $task->assignment->fresh(),
        ]);
    }

    public function approve(Request $request, Task $task): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'customer' || $task->customer_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        if (! $task->assignment || ! $task->assignment->actual_cost_submitted_at || $task->assignment->actual_cost === null) {
            return response()->json(['message' => 'No submitted actual cost to approve.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $task->assignment->update([
            'actual_cost_approved_at' => now(),
            'actual_cost_approved_by_customer' => true,
        ]);

        return response()->json([
            'message' => 'Actual cost approved by customer.',
            'assignment' => $task->assignment->fresh(),
        ]);
    }
}

