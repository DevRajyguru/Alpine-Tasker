<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminDisputeStatusRequest;
use App\Models\Dispute;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDisputeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $query = Dispute::with([
            'task:id,title,status',
            'raisedBy:id,name,email',
            'againstUser:id,name,email',
            'messages.attachments',
        ])->latest();
        if ($status) {
            $query->where('status', $status);
        }

        return response()->json([
            'disputes' => $query->paginate(20),
        ]);
    }

    public function updateStatus(AdminDisputeStatusRequest $request, Dispute $dispute): JsonResponse
    {
        $payload = [
            'status' => $request->validated('status'),
        ];
        if (in_array($payload['status'], ['resolved', 'closed'], true)) {
            $payload['resolved_by'] = $request->user()->id;
            $payload['resolved_at'] = now();
        }

        $dispute->update($payload);

        return response()->json([
            'message' => 'Dispute status updated.',
            'dispute' => $dispute->fresh(),
        ]);
    }
}
