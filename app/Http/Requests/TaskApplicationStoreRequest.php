<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskApplicationStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'offer_price' => ['required', 'numeric', 'min:1'],
            'message' => ['nullable', 'string'],
        ];
    }
}

