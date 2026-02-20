<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskOtpVerifyRequest;
use App\Http\Requests\TaskStatusActionRequest;
use App\Models\Task;
use App\Models\TaskStatusHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class TaskStatusController extends Controller
{
    public function start(TaskStatusActionRequest $request, Task $task): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'tasker' || $task->selected_tasker_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        if ($task->status !== 'assigned') {
            return response()->json(['message' => 'Only assigned tasks can be started.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $assignment = $task->assignment;
        if (! $assignment || ! $assignment->customer_otp_verified_at) {
            return response()->json([
                'message' => 'OTP verification required before starting work.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (! $this->isPaymentReadyForStart($task)) {
            return response()->json([
                'message' => 'Customer advance payment hold is required before task can start.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->changeStatus($task, 'in_progress', $user->id, $request->validated('note'), 'started_at');

        return response()->json([
            'message' => 'Task marked as in progress.',
            'task' => $task->fresh('assignment'),
        ]);
    }

    public function verifyOtpAndStart(TaskOtpVerifyRequest $request, Task $task): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'tasker' || $task->selected_tasker_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        if ($task->status !== 'assigned') {
            return response()->json(['message' => 'OTP can be verified only for assigned tasks.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $assignment = $task->assignment;
        if (! $assignment) {
            return response()->json(['message' => 'Assignment not found.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (! $assignment->customer_otp || ! $assignment->customer_otp_expires_at || now()->gt($assignment->customer_otp_expires_at)) {
            return response()->json(['message' => 'OTP expired. Ask customer to regenerate OTP.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ((int) $assignment->otp_attempts >= 5) {
            return response()->json(['message' => 'Too many invalid OTP attempts. Regenerate OTP required.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($assignment->customer_otp !== $request->validated('otp')) {
            $assignment->increment('otp_attempts');
            return response()->json(['message' => 'Invalid OTP.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $assignment->update([
            'customer_otp_verified_at' => now(),
            'otp_attempts' => 0,
        ]);

        if (! $this->isPaymentReadyForStart($task)) {
            return response()->json([
                'message' => 'Customer advance payment hold is required before task can start.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->changeStatus($task, 'in_progress', $user->id, $request->validated('note'), 'started_at');

        return response()->json([
            'message' => 'OTP verified and task started.',
            'task' => $task->fresh('assignment'),
        ]);
    }

    public function complete(TaskStatusActionRequest $request, Task $task): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'tasker' || $task->selected_tasker_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        if ($task->status !== 'in_progress') {
            return response()->json(['message' => 'Only in-progress tasks can be completed.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->changeStatus($task, 'completed', $user->id, $request->validated('note'), 'completed_at');

        return response()->json([
            'message' => 'Task marked as completed.',
            'task' => $task->fresh('assignment'),
        ]);
    }

    public function close(TaskStatusActionRequest $request, Task $task): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'customer' || $task->customer_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        if ($task->status !== 'completed') {
            return response()->json(['message' => 'Only completed tasks can be closed.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->changeStatus($task, 'closed', $user->id, $request->validated('note'), 'closed_at');

        return response()->json([
            'message' => 'Task closed successfully.',
            'task' => $task->fresh('assignment'),
        ]);
    }

    public function confirmCompletion(TaskStatusActionRequest $request, Task $task): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'customer' || $task->customer_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        if ($task->status !== 'completed') {
            return response()->json(['message' => 'Only completed tasks can be confirmed by customer.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($task->assignment && $task->assignment->closed_at) {
            return response()->json([
                'message' => 'Task completion already confirmed by customer.',
                'task' => $task->fresh('assignment'),
            ]);
        }

        if ($task->assignment) {
            $task->assignment->update([
                'closed_at' => now(),
            ]);
        }

        TaskStatusHistory::create([
            'task_id' => $task->id,
            'from_status' => 'completed',
            'to_status' => 'completed',
            'changed_by' => $user->id,
            'note' => $request->validated('note') ?? 'Customer confirmed task completion.',
        ]);

        return response()->json([
            'message' => 'Task completion confirmed by customer.',
            'task' => $task->fresh('assignment'),
        ]);
    }

    private function changeStatus(Task $task, string $toStatus, int $changedBy, ?string $note, string $assignmentTimeColumn): void
    {
        DB::transaction(function () use ($task, $toStatus, $changedBy, $note, $assignmentTimeColumn): void {
            $fromStatus = $task->status;
            $task->update(['status' => $toStatus]);

            if ($task->assignment) {
                $task->assignment->update([$assignmentTimeColumn => now()]);
            }

            TaskStatusHistory::create([
                'task_id' => $task->id,
                'from_status' => $fromStatus,
                'to_status' => $toStatus,
                'changed_by' => $changedBy,
                'note' => $note,
            ]);
        });
    }

    private function isPaymentReadyForStart(Task $task): bool
    {
        $payment = $task->payment;
        if (! $payment) {
            return false;
        }

        return in_array($payment->status, ['authorized', 'captured'], true);
    }
}
