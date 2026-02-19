<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchEventStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category' => ['required', 'string', 'max:120'],
            'location' => ['required', 'string', 'max:120'],
            'source' => ['nullable', 'string', 'max:80'],
            'guest_token' => ['nullable', 'string', 'max:120'],
        ];
    }
}

