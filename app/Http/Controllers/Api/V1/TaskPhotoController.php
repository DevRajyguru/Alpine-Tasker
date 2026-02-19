<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskPhotoUploadRequest;
use App\Models\Task;
use App\Models\TaskPhoto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class TaskPhotoController extends Controller
{
    public function index(Request $request, Task $task): JsonResponse
    {
        $user = $request->user();

        if (! $this->canAccessTaskPhotos($user->role, $user->id, $task)) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        return response()->json([
            'photos' => $task->photos()
                ->latest()
                ->get()
                ->map(function (TaskPhoto $photo): array {
                    return [
                        'id' => $photo->id,
                        'task_id' => $photo->task_id,
                        'uploaded_by' => $photo->uploaded_by,
                        'photo_type' => $photo->photo_type,
                        'file_path' => $photo->file_path,
                        'file_url' => Storage::disk('public')->url($photo->file_path),
                        'mime_type' => $photo->mime_type,
                        'file_size' => $photo->file_size,
                        'created_at' => $photo->created_at,
                    ];
                }),
        ]);
    }

    public function storeCustomerPhoto(TaskPhotoUploadRequest $request, Task $task): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'customer' || $task->customer_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        $photos = $this->storePhotos($task, $request, 'customer_detail');

        return response()->json([
            'message' => 'Customer task photos uploaded successfully.',
            'photos' => $photos,
        ], Response::HTTP_CREATED);
    }

    public function storeCompletionPhoto(TaskPhotoUploadRequest $request, Task $task): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'tasker' || $task->selected_tasker_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        if (! in_array($task->status, ['assigned', 'in_progress', 'completed'], true)) {
            return response()->json([
                'message' => 'Completion photos are not allowed in current task status.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $photos = $this->storePhotos($task, $request, 'tasker_completion');

        return response()->json([
            'message' => 'Task completion photos uploaded successfully.',
            'photos' => $photos,
        ], Response::HTTP_CREATED);
    }

    private function storePhotos(Task $task, TaskPhotoUploadRequest $request, string $type): array
    {
        $user = $request->user();
        $created = [];

        foreach ($request->file('photos', []) as $file) {
            $relativePath = $file->store("tasks/{$task->id}/{$type}", 'public');

            $photo = TaskPhoto::create([
                'task_id' => $task->id,
                'uploaded_by' => $user->id,
                'photo_type' => $type,
                'file_path' => $relativePath,
                'mime_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
            ]);

            $created[] = [
                'id' => $photo->id,
                'task_id' => $photo->task_id,
                'uploaded_by' => $photo->uploaded_by,
                'photo_type' => $photo->photo_type,
                'file_path' => $photo->file_path,
                'file_url' => Storage::disk('public')->url($photo->file_path),
                'mime_type' => $photo->mime_type,
                'file_size' => $photo->file_size,
                'created_at' => $photo->created_at,
            ];
        }

        return $created;
    }

    private function canAccessTaskPhotos(string $role, int $userId, Task $task): bool
    {
        if ($role === 'admin') {
            return true;
        }

        if ($role === 'customer' && $task->customer_id === $userId) {
            return true;
        }

        return $role === 'tasker' && $task->selected_tasker_id === $userId;
    }
}

