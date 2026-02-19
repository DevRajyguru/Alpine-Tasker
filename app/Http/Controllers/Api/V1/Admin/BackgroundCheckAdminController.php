<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\RequestTaskerBackgroundCheckJob;
use App\Models\BackgroundCheck;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BackgroundCheckAdminController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $query = BackgroundCheck::query()
            ->with(['tasker:id,name,email'])
            ->latest();
        if ($status) {
            $query->where('status', $status);
        }

        return response()->json([
            'background_checks' => $query->paginate(20),
        ]);
    }

    public function requestCheck(User $tasker): JsonResponse
    {
        if ($tasker->role !== 'tasker') {
            return response()->json(['message' => 'Selected user is not a tasker.'], 422);
        }

        RequestTaskerBackgroundCheckJob::dispatch($tasker->id);

        return response()->json([
            'message' => 'Background check job dispatched.',
        ]);
    }

    public function updateStatus(Request $request, BackgroundCheck $backgroundCheck): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'in:not_started,pending,passed,failed,review_required'],
            'report_url' => ['nullable', 'string'],
        ]);

        $backgroundCheck->update([
            'status' => $request->string('status')->toString(),
            'report_url' => $request->input('report_url'),
            'completed_at' => in_array($request->input('status'), ['passed', 'failed'], true) ? now() : null,
        ]);

        if ($backgroundCheck->tasker) {
            $backgroundCheck->tasker->update([
                'is_active' => $backgroundCheck->status === 'passed',
            ]);
        }

        return response()->json([
            'message' => 'Background check status updated.',
            'background_check' => $backgroundCheck->fresh(),
        ]);
    }
}
