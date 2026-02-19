<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminServiceUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $service = $this->route('service');

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', Rule::unique('services', 'slug')->ignore($service?->id)],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'license_not_required' => ['nullable', 'boolean'],
            'skill_not_required' => ['nullable', 'boolean'],
            'hazardous_work_not_allowed' => ['nullable', 'boolean'],
            'no_medical_childcare_electrical_work' => ['nullable', 'boolean'],
            'custom_warning_message' => ['nullable', 'string', 'max:255'],
        ];
    }
}
