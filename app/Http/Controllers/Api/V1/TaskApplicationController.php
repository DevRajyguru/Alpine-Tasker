<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskApplicationStoreRequest;
use App\Models\Task;
use App\Models\TaskApplication;
use App\Models\TaskAssignment;
use App\Models\TaskStatusHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class TaskApplicationController extends Controller
{
    public function store(TaskApplicationStoreRequest $request, Task $task): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'tasker') {
            return response()->json(['message' => 'Only taskers can apply to tasks.'], Response::HTTP_FORBIDDEN);
        }

        if (! $user->is_active) {
            return response()->json(['message' => 'Your account is pending activation.'], Response::HTTP_FORBIDDEN);
        }

        if ($task->status !== 'open') {
            return response()->json(['message' => 'Only open tasks accept applications.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $application = TaskApplication::updateOrCreate(
            ['task_id' => $task->id, 'tasker_id' => $user->id],
            [
                'offer_price' => $request->validated('offer_price'),
                'message' => $request->validated('message'),
                'status' => 'pending',
            ]
        );

        return response()->json([
            'message' => 'Application submitted successfully.',
            'application' => $application,
        ], Response::HTTP_CREATED);
    }

    public function acceptFixedPrice(Task $task): JsonResponse
    {
        $user = request()->user();

        if ($user->role !== 'tasker') {
            return response()->json(['message' => 'Only taskers can accept tasks.'], Response::HTTP_FORBIDDEN);
        }

        if (! $user->is_active) {
            return response()->json(['message' => 'Your account is pending activation.'], Response::HTTP_FORBIDDEN);
        }

        if ($task->status !== 'open' || $task->selected_tasker_id !== null) {
            return response()->json(['message' => 'Task is no longer available for fixed-price acceptance.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        DB::transaction(function () use ($task, $user): void {
            TaskApplication::updateOrCreate(
                ['task_id' => $task->id, 'tasker_id' => $user->id],
                [
                    'offer_price' => $task->budget_estimate,
                    'message' => 'Accepted fixed budget price.',
                    'status' => 'accepted',
                ]
            );

            TaskApplication::where('task_id', $task->id)
                ->where('tasker_id', '!=', $user->id)
                ->update(['status' => 'rejected']);

            TaskAssignment::updateOrCreate(
                ['task_id' => $task->id],
                [
                    'customer_id' => $task->customer_id,
                    'tasker_id' => $user->id,
                    'assigned_price' => $task->budget_estimate,
                    'payment_option' => 'pay_now',
                    'customer_otp' => $this->generateOtp(),
                    'customer_otp_expires_at' => now()->addHours(6),
                    'customer_otp_verified_at' => null,
                    'otp_attempts' => 0,
                    'assigned_at' => now(),
                ]
            );

            $fromStatus = $task->status;
            $task->update([
                'selected_tasker_id' => $user->id,
                'status' => 'assigned',
            ]);

            TaskStatusHistory::create([
                'task_id' => $task->id,
                'from_status' => $fromStatus,
                'to_status' => 'assigned',
                'changed_by' => $user->id,
                'note' => 'Task accepted by tasker at fixed budget price.',
            ]);
        });

        return response()->json([
            'message' => 'Task accepted at fixed price successfully.',
            'task' => $task->fresh(['assignment']),
        ]);
    }

    private function generateOtp(): string
    {
        return str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
    }
}
