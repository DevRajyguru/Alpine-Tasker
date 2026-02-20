<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskOtpVerifyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'otp' => ['required', 'digits:4'],
            'note' => ['nullable', 'string'],
        ];
    }
}

