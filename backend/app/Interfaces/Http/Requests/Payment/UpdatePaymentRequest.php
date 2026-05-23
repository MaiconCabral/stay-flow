<?php

namespace App\Interfaces\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['nullable', 'numeric', 'min:0.01'],
            'payment_method' => ['nullable', 'string', 'in:card,pix,transfer'],
            'status' => ['nullable', 'string', 'in:pending,completed,failed,refunded'],
            'payment_date' => ['nullable', 'date'],
            'transaction_id' => ['nullable', 'string', 'max:255'],
        ];
    }
}
