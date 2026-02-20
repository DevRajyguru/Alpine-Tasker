<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\DisputeMessageStoreRequest;
use App\Models\Dispute;
use App\Models\DisputeAttachment;
use App\Models\DisputeMessage;
use Illuminate\Http\JsonResponse;

class DisputeMessageController extends Controller
{
    public function store(DisputeMessageStoreRequest $request, Dispute $dispute): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $dispute->raised_by !== $user->id && $dispute->against_user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $message = DisputeMessage::create([
            'dispute_id' => $dispute->id,
            'sender_id' => $user->id,
            'message' => $request->validated('message'),
            'is_internal' => false,
        ]);

        foreach ($request->file('attachments', []) as $file) {
            $path = $file->store("disputes/{$dispute->id}", 'public');
            DisputeAttachment::create([
                'dispute_message_id' => $message->id,
                'file_path' => $path,
                'mime_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
            ]);
        }

        return response()->json([
            'message' => 'Reply posted successfully.',
            'dispute_message' => $message->load('attachments'),
        ], 201);
    }
}

