<?php

namespace App\Interfaces\Http\Resources;

use App\Domain\Availability\Availability;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Availability */
class AvailabilityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'property_id' => $this->property_id,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'is_available' => $this->is_available,
            'price' => $this->price,
            'property' => $this->whenLoaded('property', fn () => [
                'id' => $this->property->id,
                'title' => $this->property->title,
                'slug' => $this->property->slug,
                'city' => $this->property->city,
                'state' => $this->property->state,
                'property_type' => $this->property->property_type?->value,
                'property_type_label' => $this->property->property_type?->label(),
                'price_per_night' => $this->property->price_per_night,
                'max_guests' => $this->property->max_guests,
            ]),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
