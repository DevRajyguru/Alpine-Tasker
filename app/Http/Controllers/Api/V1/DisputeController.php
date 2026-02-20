<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\DisputeStoreRequest;
use App\Models\Dispute;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DisputeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Dispute::query()
            ->with(['messages.attachments'])
            ->latest();

        if ($user->role !== 'admin') {
            $query->where(function ($q) use ($user): void {
                $q->where('raised_by', $user->id)->orWhere('against_user_id', $user->id);
            });
        }

        return response()->json([
            'disputes' => $query->paginate(15),
        ]);
    }

    public function show(Request $request, Dispute $dispute): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $dispute->raised_by !== $user->id && $dispute->against_user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json([
            'dispute' => $dispute->load('messages.attachments'),
        ]);
    }

    public function store(DisputeStoreRequest $request): JsonResponse
    {
        $user = $request->user();
        $task = Task::findOrFail($request->validated('task_id'));

        $isTaskParticipant = $task->customer_id === $user->id || $task->selected_tasker_id === $user->id;
        if (! $isTaskParticipant) {
            return response()->json(['message' => 'You can only dispute your own task engagement.'], 403);
        }

        $dispute = Dispute::create([
            'task_id' => $task->id,
            'raised_by' => $user->id,
            'against_user_id' => $request->validated('against_user_id'),
            'subject' => $request->validated('subject'),
            'description' => $request->validated('description'),
            'priority' => $request->validated('priority', 'medium'),
            'status' => 'open',
        ]);

        return response()->json([
            'message' => 'Dispute raised successfully.',
            'dispute' => $dispute,
        ], 201);
    }
}

