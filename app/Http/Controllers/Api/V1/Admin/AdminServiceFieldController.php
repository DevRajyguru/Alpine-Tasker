<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminServiceFieldReorderRequest;
use App\Http\Requests\AdminServiceFieldStoreRequest;
use App\Http\Requests\AdminServiceFieldUpdateRequest;
use App\Models\Service;
use App\Models\ServiceField;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminServiceFieldController extends Controller
{
    public function index(Service $service): JsonResponse
    {
        return response()->json([
            'fields' => $service->fields()->with('options')->get(),
        ]);
    }

    public function store(AdminServiceFieldStoreRequest $request, Service $service): JsonResponse
    {
        $payload = $request->validated();

        $field = DB::transaction(function () use ($payload, $service): ServiceField {
            $newField = $service->fields()->create([
                'label' => $payload['label'],
                'key' => $payload['key'],
                'type' => $payload['type'],
                'is_required' => $payload['is_required'] ?? false,
                'min_value' => $payload['min_value'] ?? null,
                'max_value' => $payload['max_value'] ?? null,
                'placeholder' => $payload['placeholder'] ?? null,
                'help_text' => $payload['help_text'] ?? null,
                'visibility_json' => $payload['visibility_json'] ?? ['customer', 'tasker', 'admin'],
                'conditional_json' => $payload['conditional_json'] ?? null,
                'warning_message' => $payload['warning_message'] ?? null,
                'sort_order' => $payload['sort_order'] ?? ((int) $service->fields()->max('sort_order') + 1),
                'config_json' => $payload['config_json'] ?? null,
            ]);

            foreach ($payload['options'] ?? [] as $option) {
                $newField->options()->create([
                    'label' => $option['label'],
                    'value' => $option['value'],
                    'sort_order' => $option['sort_order'] ?? 0,
                ]);
            }

            return $newField;
        });

        return response()->json([
            'message' => 'Service field created.',
            'field' => $field->load('options'),
        ], 201);
    }

    public function update(AdminServiceFieldUpdateRequest $request, Service $service, ServiceField $field): JsonResponse
    {
        if ($field->service_id !== $service->id) {
            return response()->json(['message' => 'Field does not belong to this service.'], 422);
        }

        $payload = $request->validated();

        DB::transaction(function () use ($field, $payload): void {
            $field->update(array_filter([
                'label' => $payload['label'] ?? null,
                'key' => $payload['key'] ?? null,
                'type' => $payload['type'] ?? null,
                'is_required' => $payload['is_required'] ?? null,
                'min_value' => $payload['min_value'] ?? null,
                'max_value' => $payload['max_value'] ?? null,
                'placeholder' => $payload['placeholder'] ?? null,
                'help_text' => $payload['help_text'] ?? null,
                'visibility_json' => $payload['visibility_json'] ?? null,
                'conditional_json' => $payload['conditional_json'] ?? null,
                'warning_message' => $payload['warning_message'] ?? null,
                'sort_order' => $payload['sort_order'] ?? null,
                'config_json' => $payload['config_json'] ?? null,
            ], static fn ($value) => $value !== null));

            if (array_key_exists('options', $payload)) {
                $field->options()->delete();
                foreach ($payload['options'] ?? [] as $option) {
                    $field->options()->create([
                        'label' => $option['label'],
                        'value' => $option['value'],
                        'sort_order' => $option['sort_order'] ?? 0,
                    ]);
                }
            }
        });

        return response()->json([
            'message' => 'Service field updated.',
            'field' => $field->fresh('options'),
        ]);
    }

    public function destroy(Service $service, ServiceField $field): JsonResponse
    {
        if ($field->service_id !== $service->id) {
            return response()->json(['message' => 'Field does not belong to this service.'], 422);
        }

        $field->delete();

        return response()->json([
            'message' => 'Service field deleted.',
        ]);
    }

    public function reorder(AdminServiceFieldReorderRequest $request, Service $service): JsonResponse
    {
        $ids = $request->validated('field_ids');
        $fields = $service->fields()->pluck('id')->all();

        foreach ($ids as $id) {
            if (! in_array($id, $fields, true)) {
                return response()->json(['message' => 'Invalid field order for this service.'], 422);
            }
        }

        DB::transaction(function () use ($ids): void {
            foreach ($ids as $index => $id) {
                ServiceField::whereKey($id)->update(['sort_order' => $index + 1]);
            }
        });

        return response()->json([
            'message' => 'Service fields reordered.',
        ]);
    }
}
