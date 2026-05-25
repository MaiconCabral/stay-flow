<?php

namespace App\Interfaces\Http\Requests\Property;

use Illuminate\Foundation\Http\FormRequest;

class UploadPropertyImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:10240'],
            'is_cover' => ['boolean'],
        ];
    }
}
