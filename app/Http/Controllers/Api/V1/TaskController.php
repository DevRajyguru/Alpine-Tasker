<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskStatusActionRequest;
use App\Http\Requests\TaskStoreRequest;
use App\Http\Requests\TaskUpdateRequest;
use App\Models\Service;
use App\Models\ServiceField;
use App\Models\Task;
use App\Models\TaskFieldValue;
use App\Models\TaskStatusHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class TaskController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Task::query()->with(['customer:id,name,email', 'selectedTasker:id,name,email', 'assignment', 'payment.payout', 'review']);

        if ($user->role === 'customer') {
            $query->where('customer_id', $user->id);
        } elseif ($user->role === 'tasker') {
            $query->where(function ($q) use ($user): void {
                $q->where('status', 'open')
                    ->orWhere('selected_tasker_id', $user->id);
            });
        }

        return response()->json([
            'tasks' => $query->latest()->paginate(15),
        ]);
    }

    public function show(Request $request, Task $task): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'customer' && $task->customer_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        if ($user->role === 'tasker' && $task->status !== 'open' && $task->selected_tasker_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        $taskData = $task->load(['applications.tasker:id,name,email', 'assignment', 'statusHistory', 'payment.payout', 'review']);
        if ($taskData->assignment && ! ($user->role === 'customer' && $task->customer_id === $user->id)) {
            $taskData->assignment->customer_otp = null;
        }

        return response()->json([
            'task' => $taskData,
        ]);
    }

    public function store(TaskStoreRequest $request): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'customer') {
            return response()->json(['message' => 'Only customers can create tasks.'], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validated();
        $service = isset($validated['service_id']) ? Service::find($validated['service_id']) : null;
        $dynamicValues = $validated['dynamic_fields'] ?? [];
        $dynamicValidationErrors = $this->validateDynamicFields($request, $service, $dynamicValues);
        if ($dynamicValidationErrors !== []) {
            return response()->json([
                'message' => 'Dynamic field validation failed.',
                'errors' => $dynamicValidationErrors,
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $dynamicWarnings = $this->resolveDynamicWarnings($service, $dynamicValues);

        $task = DB::transaction(function () use ($validated, $user, $service, $dynamicValues, $request) {
            $newTask = Task::create([
                'customer_id' => $user->id,
                'category_id' => $validated['category_id'],
                'service_id' => $validated['service_id'] ?? null,
                'title' => $validated['title'],
                'description' => $validated['description'],
                'budget_estimate' => $validated['budget_estimate'],
                'scheduled_at' => $validated['scheduled_at'] ?? null,
                'address' => $validated['address'],
                'city' => $validated['city'],
                'status' => 'open',
            ]);

            TaskStatusHistory::create([
                'task_id' => $newTask->id,
                'from_status' => null,
                'to_status' => 'open',
                'changed_by' => $user->id,
                'note' => 'Task created',
            ]);

            if ($service) {
                $fields = $service->fields()->with('options')->get()->keyBy('key');
                foreach ($fields as $key => $field) {
                    $this->storeTaskFieldValue($request, $newTask, $field, $dynamicValues[$key] ?? null);
                }
            }

            return $newTask;
        });

        return response()->json([
            'message' => 'Task created successfully.',
            'task' => $task->load(['service.fields.options', 'fieldValues.field']),
            'warnings' => $dynamicWarnings,
        ], Response::HTTP_CREATED);
    }

    public function update(TaskUpdateRequest $request, Task $task): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'customer' || $task->customer_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        if ($task->status !== 'open') {
            return response()->json(['message' => 'Only open tasks can be updated.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $task->update($request->validated());

        return response()->json([
            'message' => 'Task updated successfully.',
            'task' => $task->fresh(),
        ]);
    }

    public function cancel(TaskStatusActionRequest $request, Task $task): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'customer' || $task->customer_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], Response::HTTP_FORBIDDEN);
        }

        if (! in_array($task->status, ['open', 'assigned'], true)) {
            return response()->json(['message' => 'Task cannot be cancelled in current state.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $from = $task->status;
        $task->update(['status' => 'cancelled']);

        if ($task->payment && $task->payment->status === 'authorized') {
            $task->payment->update([
                'status' => 'voided',
            ]);
        }

        TaskStatusHistory::create([
            'task_id' => $task->id,
            'from_status' => $from,
            'to_status' => 'cancelled',
            'changed_by' => $user->id,
            'note' => $request->validated('note'),
        ]);

        return response()->json([
            'message' => 'Task cancelled successfully.',
            'task' => $task->fresh(),
        ]);
    }

    private function validateDynamicFields(Request $request, ?Service $service, array $dynamicValues): array
    {
        if (! $service) {
            return [];
        }

        $errors = [];
        $fields = $service->fields()->with('options')->get();

        foreach ($fields as $field) {
            $key = $field->key;
            $value = $dynamicValues[$key] ?? null;
            $hasFile = $request->hasFile("dynamic_files.{$key}");

            if ($field->is_required && $value === null && ! $hasFile) {
                $errors[$key][] = 'This field is required.';
                continue;
            }

            if ($value === null && ! $hasFile) {
                continue;
            }

            switch ($field->type) {
                case 'text_input':
                case 'location_picker':
                    if ($value !== null && ! is_string($value)) {
                        $errors[$key][] = 'Must be a string.';
                    }
                    break;
                case 'number_input':
                case 'duration_selector':
                case 'weight_selector':
                case 'quantity_selector':
                    if ($value !== null && ! is_numeric($value)) {
                        $errors[$key][] = 'Must be a number.';
                        break;
                    }
                    if ($value !== null && $field->min_value !== null && (float) $value < (float) $field->min_value) {
                        $errors[$key][] = "Must be at least {$field->min_value}.";
                    }
                    if ($value !== null && $field->max_value !== null && (float) $value > (float) $field->max_value) {
                        $errors[$key][] = "Must be at most {$field->max_value}.";
                    }
                    break;
                case 'dropdown':
                    $allowed = $field->options->pluck('value')->all();
                    if (! in_array((string) $value, $allowed, true)) {
                        $errors[$key][] = 'Invalid option selected.';
                    }
                    break;
                case 'checkbox':
                    if (! is_bool($value) && ! in_array($value, [0, 1, '0', '1'], true)) {
                        $errors[$key][] = 'Must be a boolean.';
                    }
                    break;
                case 'date_time_picker':
                    if ($value !== null && strtotime((string) $value) === false) {
                        $errors[$key][] = 'Must be a valid date/time.';
                    }
                    break;
                case 'image_upload':
                    if (! $hasFile && $field->is_required) {
                        $errors[$key][] = 'Image file is required.';
                    }
                    break;
                default:
                    $errors[$key][] = 'Unsupported field type.';
            }
        }

        return $errors;
    }

    private function resolveDynamicWarnings(?Service $service, array $dynamicValues): array
    {
        if (! $service) {
            return [];
        }

        $warnings = [];
        $fields = $service->fields()->get();
        foreach ($fields as $field) {
            $condition = $field->conditional_json;
            if (! is_array($condition) || ! isset($condition['depends_on'], $condition['operator'])) {
                continue;
            }

            $dependsOnKey = (string) $condition['depends_on'];
            $operator = (string) $condition['operator'];
            $threshold = $condition['value'] ?? null;
            $actual = $dynamicValues[$dependsOnKey] ?? null;
            if ($actual === null) {
                continue;
            }

            $match = $this->compareConditional($actual, $operator, $threshold);
            if ($match && $field->warning_message) {
                $warnings[] = [
                    'field_key' => $field->key,
                    'depends_on' => $dependsOnKey,
                    'message' => $field->warning_message,
                ];
            }
        }

        return $warnings;
    }

    private function compareConditional(mixed $actual, string $operator, mixed $threshold): bool
    {
        $a = is_numeric($actual) ? (float) $actual : (string) $actual;
        $b = is_numeric($threshold) ? (float) $threshold : (string) $threshold;

        return match ($operator) {
            '>' => $a > $b,
            '<' => $a < $b,
            '>=' => $a >= $b,
            '<=' => $a <= $b,
            '==' => $a == $b,
            '!=' => $a != $b,
            default => false,
        };
    }

    private function storeTaskFieldValue(Request $request, Task $task, ServiceField $field, mixed $value): void
    {
        $payload = [
            'task_id' => $task->id,
            'service_field_id' => $field->id,
            'value_text' => null,
            'value_number' => null,
            'value_bool' => null,
            'value_json' => null,
            'file_path' => null,
        ];

        switch ($field->type) {
            case 'text_input':
            case 'location_picker':
            case 'dropdown':
            case 'date_time_picker':
                $payload['value_text'] = $value !== null ? (string) $value : null;
                break;
            case 'number_input':
            case 'duration_selector':
            case 'weight_selector':
            case 'quantity_selector':
                $payload['value_number'] = $value !== null ? (float) $value : null;
                break;
            case 'checkbox':
                $payload['value_bool'] = $value !== null ? (bool) $value : null;
                break;
            case 'image_upload':
                if ($request->hasFile("dynamic_files.{$field->key}")) {
                    $path = $request->file("dynamic_files.{$field->key}")
                        ->store("tasks/{$task->id}/dynamic", 'public');
                    $payload['file_path'] = $path;
                }
                break;
        }

        $hasValue = $payload['value_text'] !== null
            || $payload['value_number'] !== null
            || $payload['value_bool'] !== null
            || $payload['value_json'] !== null
            || $payload['file_path'] !== null;

        if ($hasValue) {
            TaskFieldValue::create($payload);
        }
    }
}
