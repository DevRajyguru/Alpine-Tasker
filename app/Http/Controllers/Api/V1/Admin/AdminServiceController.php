<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminServiceStoreRequest;
use App\Http\Requests\AdminServiceUpdateRequest;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class AdminServiceController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'services' => Service::withCount('fields')->latest()->paginate(20),
        ]);
    }

    public function store(AdminServiceStoreRequest $request): JsonResponse
    {
        $service = Service::create($request->validated());

        return response()->json([
            'message' => 'Service created.',
            'service' => $service,
        ], 201);
    }

    public function show(Service $service): JsonResponse
    {
        return response()->json([
            'service' => $service->load('fields.options'),
        ]);
    }

    public function update(AdminServiceUpdateRequest $request, Service $service): JsonResponse
    {
        $service->update($request->validated());

        return response()->json([
            'message' => 'Service updated.',
            'service' => $service->fresh(),
        ]);
    }

    public function destroy(Service $service): JsonResponse
    {
        $service->delete();

        return response()->json([
            'message' => 'Service deleted.',
        ]);
    }
}

