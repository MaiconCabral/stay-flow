<?php

namespace App\Interfaces\Http\Requests\Wishlist;

use Illuminate\Foundation\Http\FormRequest;

class StoreWishlistRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'property_id' => ['required', 'integer', 'exists:properties,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'property_id.required' => 'O ID da propriedade é obrigatório.',
            'property_id.exists' => 'A propriedade informada não existe.',
        ];
    }
}
