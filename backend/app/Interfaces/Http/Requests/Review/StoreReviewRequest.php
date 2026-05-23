<?php

namespace App\Interfaces\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reservation_id' => ['required', 'integer', 'exists:reservations,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'min:10', 'max:5000'],
        ];
    }

    public function messages(): array
    {
        return [
            'rating.required' => 'A avaliação é obrigatória.',
            'rating.min' => 'A avaliação deve ser entre 1 e 5.',
            'rating.max' => 'A avaliação deve ser entre 1 e 5.',
            'comment.required' => 'O comentário é obrigatório.',
            'comment.min' => 'O comentário deve ter pelo menos 10 caracteres.',
        ];
    }
}
