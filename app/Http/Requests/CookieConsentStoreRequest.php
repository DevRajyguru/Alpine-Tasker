<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CookieConsentStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'policy_version' => ['required', 'string', 'max:20'],
            'analytics' => ['nullable', 'boolean'],
            'marketing' => ['nullable', 'boolean'],
            'guest_token' => ['nullable', 'string', 'max:120'],
        ];
    }
}

