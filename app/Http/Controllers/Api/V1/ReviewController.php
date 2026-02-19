<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewStoreRequest;
use App\Http\Requests\ReviewUpdateRequest;
use App\Models\Review;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ReviewController extends Controller
{
    public function store(ReviewStoreRequest $request, Task $task): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'customer' || $task->customer_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        if (! in_array($task->status, ['completed', 'closed'], true)) {
            return response()->json(['message' => 'Review allowed only after task completion.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (! $task->selected_tasker_id) {
            return response()->json(['message' => 'Task has no assigned tasker.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $existing = Review::where('task_id', $task->id)->first();
        if ($existing) {
            return response()->json(['message' => 'Review already submitted for this task.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $review = Review::create([
            'task_id' => $task->id,
            'customer_id' => $user->id,
            'tasker_id' => $task->selected_tasker_id,
            'rating' => $request->validated('rating'),
            'comment' => $request->validated('comment'),
        ]);

        return response()->json([
            'message' => 'Review submitted successfully.',
            'review' => $review->load(['customer:id,name', 'tasker:id,name']),
        ], Response::HTTP_CREATED);
    }

    public function update(ReviewUpdateRequest $request, Task $task): JsonResponse
    {
        $user = $request->user();
        $review = Review::where('task_id', $task->id)->first();

        if (! $review) {
            return response()->json(['message' => 'Review not found for this task.'], Response::HTTP_NOT_FOUND);
        }

        if ($user->role !== 'customer' || $review->customer_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        $review->update($request->validated());

        return response()->json([
            'message' => 'Review updated successfully.',
            'review' => $review->fresh(['customer:id,name', 'tasker:id,name']),
        ]);
    }

    public function taskerReviews(User $tasker): JsonResponse
    {
        if ($tasker->role !== 'tasker') {
            return response()->json(['message' => 'User is not a tasker.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $reviews = Review::where('tasker_id', $tasker->id)
            ->with(['customer:id,name', 'task:id,title,status'])
            ->latest()
            ->paginate(20);

        $avgRating = (float) Review::where('tasker_id', $tasker->id)->avg('rating');

        return response()->json([
            'tasker_id' => $tasker->id,
            'average_rating' => round($avgRating, 2),
            'total_reviews' => Review::where('tasker_id', $tasker->id)->count(),
            'reviews' => $reviews,
        ]);
    }
}

