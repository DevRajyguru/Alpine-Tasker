<?php

namespace App\Http\Requests;

use App\Models\ServiceField;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminServiceFieldStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'label' => ['required', 'string', 'max:255'],
            'key' => ['required', 'string', 'max:120'],
            'type' => ['required', Rule::in(ServiceField::TYPES)],
            'is_required' => ['nullable', 'boolean'],
            'min_value' => ['nullable', 'numeric'],
            'max_value' => ['nullable', 'numeric', 'gte:min_value'],
            'placeholder' => ['nullable', 'string', 'max:255'],
            'help_text' => ['nullable', 'string', 'max:255'],
            'visibility_json' => ['nullable', 'array'],
            'visibility_json.*' => ['in:customer,tasker,admin'],
            'conditional_json' => ['nullable', 'array'],
            'conditional_json.depends_on' => ['required_with:conditional_json', 'string', 'max:120'],
            'conditional_json.operator' => ['required_with:conditional_json', 'in:>,<,>=,<=,==,!='],
            'conditional_json.value' => ['required_with:conditional_json'],
            'warning_message' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'config_json' => ['nullable', 'array'],
            'options' => ['nullable', 'array'],
            'options.*.label' => ['required_with:options', 'string', 'max:120'],
            'options.*.value' => ['required_with:options', 'string', 'max:120'],
            'options.*.sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
