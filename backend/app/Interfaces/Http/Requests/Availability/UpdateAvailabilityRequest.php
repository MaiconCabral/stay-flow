<?php

namespace App\Interfaces\Http\Requests\Availability;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'start_date' => ['sometimes', 'required', 'date'],
            'end_date' => ['sometimes', 'required', 'date', 'after_or_equal:start_date'],
            'is_available' => ['sometimes', 'boolean'],
            'price' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
