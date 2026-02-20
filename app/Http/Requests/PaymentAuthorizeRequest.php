<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentAuthorizeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'task_amount' => ['required', 'numeric', 'min:1'],
            'coupon_code' => ['nullable', 'string', 'max:50'],
            'currency' => ['nullable', 'string', 'size:3'],
            'payment_method_id' => ['nullable', 'string', 'max:255'],
        ];
    }
}
