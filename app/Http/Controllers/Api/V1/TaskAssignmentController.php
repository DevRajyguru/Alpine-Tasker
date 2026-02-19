<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskAssignRequest;
use App\Models\Task;
use App\Models\TaskApplication;
use App\Models\TaskAssignment;
use App\Models\TaskStatusHistory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class TaskAssignmentController extends Controller
{
    public function assign(TaskAssignRequest $request, Task $task, User $tasker): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'customer' || $task->customer_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        if ($task->status !== 'open') {
            return response()->json(['message' => 'Task must be open for assignment.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($tasker->role !== 'tasker' || ! $tasker->is_active) {
            return response()->json(['message' => 'Selected user is not an active tasker.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $application = TaskApplication::where('task_id', $task->id)
            ->where('tasker_id', $tasker->id)
            ->first();

        DB::transaction(function () use ($task, $tasker, $application, $request, $user): void {
            if ($application) {
                TaskApplication::where('task_id', $task->id)
                    ->where('id', '!=', $application->id)
                    ->update(['status' => 'rejected']);

                $application->update(['status' => 'accepted']);
            } else {
                TaskApplication::where('task_id', $task->id)
                    ->update(['status' => 'rejected']);

                $application = TaskApplication::create([
                    'task_id' => $task->id,
                    'tasker_id' => $tasker->id,
                    'offer_price' => $request->validated('assigned_price') ?? $task->budget_estimate,
                    'message' => 'Direct assignment by customer selection.',
                    'status' => 'accepted',
                ]);
            }

            TaskAssignment::updateOrCreate(
                ['task_id' => $task->id],
                [
                    'customer_id' => $user->id,
                    'tasker_id' => $tasker->id,
                    'assigned_price' => $request->validated('assigned_price') ?? $application->offer_price,
                    'event_type' => $request->validated('event_type'),
                    'service_level' => $request->validated('service_level'),
                    'preferred_date' => $request->validated('preferred_date'),
                    'preferred_time' => $request->validated('preferred_time'),
                    'booking_description' => $request->validated('booking_description'),
                    'payment_option' => $request->validated('payment_option', 'pay_now'),
                    'customer_otp' => $this->generateOtp(),
                    'customer_otp_expires_at' => now()->addHours(6),
                    'customer_otp_verified_at' => null,
                    'otp_attempts' => 0,
                    'assigned_at' => now(),
                ]
            );

            $fromStatus = $task->status;
            $task->update([
                'selected_tasker_id' => $tasker->id,
                'status' => 'assigned',
            ]);

            TaskStatusHistory::create([
                'task_id' => $task->id,
                'from_status' => $fromStatus,
                'to_status' => 'assigned',
                'changed_by' => $user->id,
                'note' => $request->validated('note'),
            ]);
        });

        return response()->json([
            'message' => 'Task assigned successfully.',
            'task' => $task->fresh(['assignment', 'applications']),
        ]);
    }

    public function getCustomerOtp(Request $request, Task $task): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'customer' || $task->customer_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        $assignment = $task->assignment;
        if (! $assignment) {
            return response()->json(['message' => 'Task is not assigned yet.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (! $assignment->customer_otp || ! $assignment->customer_otp_expires_at || now()->gt($assignment->customer_otp_expires_at)) {
            $assignment->update([
                'customer_otp' => $this->generateOtp(),
                'customer_otp_expires_at' => now()->addHours(6),
                'customer_otp_verified_at' => null,
                'otp_attempts' => 0,
            ]);
        }

        return response()->json([
            'message' => 'Customer OTP ready.',
            'otp' => $assignment->customer_otp,
            'expires_at' => $assignment->customer_otp_expires_at,
        ]);
    }

    public function regenerateCustomerOtp(Request $request, Task $task): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'customer' || $task->customer_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        $assignment = $task->assignment;
        if (! $assignment) {
            return response()->json(['message' => 'Task is not assigned yet.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $assignment->update([
            'customer_otp' => $this->generateOtp(),
            'customer_otp_expires_at' => now()->addHours(6),
            'customer_otp_verified_at' => null,
            'otp_attempts' => 0,
        ]);

        return response()->json([
            'message' => 'Customer OTP regenerated.',
            'otp' => $assignment->customer_otp,
            'expires_at' => $assignment->customer_otp_expires_at,
        ]);
    }

    private function generateOtp(): string
    {
        return str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
    }
}
