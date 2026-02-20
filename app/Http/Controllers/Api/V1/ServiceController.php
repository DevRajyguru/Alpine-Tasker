<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'services' => Service::where('is_active', true)
                ->withCount('fields')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function show(Request $request, Service $service): JsonResponse
    {
        if (! $service->is_active) {
            return response()->json(['message' => 'Service is inactive.'], 422);
        }

        $role = $request->user()?->role ?? 'customer';
        $service->load('fields.options');
        $service->setRelation('fields', $service->fields->filter(function ($field) use ($role) {
            $visibility = $field->visibility_json ?: ['customer', 'tasker', 'admin'];
            return in_array($role, $visibility, true);
        })->values());

        return response()->json([
            'service' => $service,
        ]);
    }
}
