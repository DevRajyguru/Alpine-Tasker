<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $category = trim((string) $request->query('category', ''));
        $location = trim((string) $request->query('location', ''));

        $query = User::query()
            ->where('role', 'tasker')
            ->where('is_active', true)
            ->with([
                'taskerProfile:user_id,hourly_rate',
                'backgroundCheck:id,tasker_id,status',
            ]);

        if ($request->filled('q')) {
            $term = (string) $request->query('q');
            $query->where(function ($inner) use ($term): void {
                $inner->where('name', 'like', "%{$term}%")
                    ->orWhere('email', 'like', "%{$term}%");
            });
        }

        if ($category !== '') {
            $query->whereHas('taskerProfile', function ($profileQuery) use ($category): void {
                $profileQuery->where(function ($inner) use ($category): void {
                    $inner->where('skills_text', 'like', "%{$category}%")
                        ->orWhere('bio', 'like', "%{$category}%");
                });
            });
        }

        if ($location !== '') {
            $query->whereHas('taskerProfile', function ($profileQuery) use ($location): void {
                $profileQuery->where('availability_text', 'like', "%{$location}%");
            });
        }

        $taskers = $query->latest()->get()->map(function (User $tasker): array {
            $avg = (float) $tasker->receivedReviews()->avg('rating');
            return [
                'id' => $tasker->id,
                'name' => $tasker->name,
                'email' => $tasker->email,
                'hourly_rate' => $tasker->taskerProfile?->hourly_rate,
                'average_rating' => round($avg > 0 ? $avg : 4.8, 1),
                'total_reviews' => (int) $tasker->receivedReviews()->count(),
                'background_check_status' => $tasker->backgroundCheck?->status,
            ];
        });

        return response()->json([
            'taskers' => $taskers,
        ]);
    }
}
