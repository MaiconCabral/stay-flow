<?php

namespace App\Interfaces\Http\Requests\Reservation;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'check_in' => ['sometimes', 'required', 'date', 'after_or_equal:today'],
            'check_out' => ['sometimes', 'required', 'date', 'after:check_in'],
            'total_guests' => ['sometimes', 'required', 'integer', 'min:1', 'max:50'],
            'subtotal' => ['nullable', 'numeric', 'min:0'],
            'service_fee' => ['nullable', 'numeric', 'min:0'],
            'cleaning_fee' => ['nullable', 'numeric', 'min:0'],
            'total_price' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
