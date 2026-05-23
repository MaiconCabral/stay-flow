<?php

namespace App\Interfaces\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rating' => ['sometimes', 'integer', 'min:1', 'max:5'],
            'comment' => ['sometimes', 'string', 'min:10', 'max:5000'],
            'host_reply' => ['nullable', 'string', 'max:5000'],
        ];
    }

    public function messages(): array
    {
        return [
            'rating.min' => 'A avaliação deve ser entre 1 e 5.',
            'rating.max' => 'A avaliação deve ser entre 1 e 5.',
            'comment.min' => 'O comentário deve ter pelo menos 10 caracteres.',
        ];
    }
}
