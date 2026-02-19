<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminServiceFieldReorderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'field_ids' => ['required', 'array', 'min:1'],
            'field_ids.*' => ['required', 'integer', 'exists:service_fields,id'],
        ];
    }
}

