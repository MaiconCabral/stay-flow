<?php

namespace App\Interfaces\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNotificationSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'new_booking' => ['sometimes', 'boolean'],
            'cancellations' => ['sometimes', 'boolean'],
            'messages' => ['sometimes', 'boolean'],
            'reviews' => ['sometimes', 'boolean'],
            'reminders' => ['sometimes', 'boolean'],
            'weekly_report' => ['sometimes', 'boolean'],
        ];
    }
}
