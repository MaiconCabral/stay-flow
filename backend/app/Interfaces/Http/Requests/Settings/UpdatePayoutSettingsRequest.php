<?php

namespace App\Interfaces\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePayoutSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'method' => ['sometimes', 'string', 'in:pix,ted,paypal'],
            'pix_key' => ['nullable', 'string', 'max:255'],
            'bank' => ['nullable', 'string', 'max:255'],
            'agency' => ['nullable', 'string', 'max:20'],
            'account' => ['nullable', 'string', 'max:20'],
            'paypal_email' => ['nullable', 'email', 'max:255'],
            'threshold' => ['sometimes', 'numeric', 'min:0'],
            'schedule' => ['sometimes', 'string', 'in:daily,weekly,monthly'],
        ];
    }
}
