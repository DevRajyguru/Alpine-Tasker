<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'service_id' => ['nullable', 'integer', 'exists:services,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'budget_estimate' => ['required', 'numeric', 'min:1'],
            'scheduled_at' => ['nullable', 'date'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:120'],
            'dynamic_fields' => ['nullable', 'array'],
            'dynamic_files' => ['nullable', 'array'],
            'dynamic_files.*' => ['file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:5120'],
        ];
    }
}
