<?php

namespace App\Interfaces\Http\Requests\Property;

use Illuminate\Foundation\Http\FormRequest;

class StorePropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:properties,slug'],
            'type' => ['sometimes', 'string', 'in:entire_place,private_room,shared_room'],
            'description' => ['required', 'string'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'zip_code' => ['nullable', 'string', 'max:20'],
            'property_type' => ['required', 'string', 'in:house,apartment,villa,cabin,cottage,loft,studio,other'],
            'price_per_night' => ['required', 'numeric', 'min:0'],
            'cleaning_fee' => ['nullable', 'numeric', 'min:0'],
            'max_guests' => ['required', 'integer', 'min:1', 'max:50'],
            'bedrooms' => ['required', 'integer', 'min:0', 'max:50'],
            'bathrooms' => ['required', 'integer', 'min:0', 'max:50'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'status' => ['sometimes', 'string', 'in:available,unavailable,pending'],
            'check_in_time' => ['nullable', 'date_format:H:i:s'],
            'check_out_time' => ['nullable', 'date_format:H:i:s'],
        ];
    }
}
