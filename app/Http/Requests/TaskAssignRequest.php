<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskAssignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'assigned_price' => ['nullable', 'numeric', 'min:1'],
            'event_type' => ['nullable', 'string', 'max:120'],
            'service_level' => ['nullable', 'string', 'max:120'],
            'preferred_date' => ['nullable', 'date'],
            'preferred_time' => ['nullable', 'date_format:H:i'],
            'booking_description' => ['nullable', 'string'],
            'payment_option' => ['nullable', 'in:pay_now,pay_after_service'],
            'note' => ['nullable', 'string'],
        ];
    }
}
