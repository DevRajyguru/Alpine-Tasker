<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::query()
            ->select(['id', 'name', 'email', 'role', 'is_active', 'created_at'])
            ->with([
                'taskerProfile:user_id,skills_text,availability_text,hourly_rate',
                'backgroundCheck:id,tasker_id,status,provider',
            ])
            ->latest();

        if ($request->filled('role')) {
            $query->where('role', $request->query('role'));
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', filter_var($request->query('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        return response()->json([
            'users' => $query->paginate(20),
        ]);
    }

    public function updateStatus(Request $request, User $user): JsonResponse
    {
        $payload = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        if ($user->role === 'admin' && $user->id === $request->user()->id && $payload['is_active'] === false) {
            return response()->json(['message' => 'You cannot deactivate your own admin account.'], 422);
        }

        $user->update([
            'is_active' => $payload['is_active'],
        ]);

        return response()->json([
            'message' => 'User status updated.',
            'user' => $user->fresh(['taskerProfile', 'backgroundCheck']),
        ]);
    }
}

