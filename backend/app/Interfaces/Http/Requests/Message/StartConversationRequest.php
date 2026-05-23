<?php

namespace App\Interfaces\Http\Requests\Message;

use Illuminate\Foundation\Http\FormRequest;

class StartConversationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'property_id' => ['required', 'integer', 'exists:properties,id'],
            'reservation_id' => ['nullable', 'integer', 'exists:reservations,id'],
            'content' => ['required', 'string', 'max:5000'],
        ];
    }
}
