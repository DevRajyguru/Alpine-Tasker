<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskerProfileUpsertRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bio' => ['nullable', 'string'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:80'],
            'skills_text' => ['nullable', 'string'],
            'availability_text' => ['nullable', 'string'],
            'hourly_rate' => ['nullable', 'numeric', 'min:0'],
            'stripe_account_type' => ['nullable', 'in:standard,express'],
        ];
    }
}
