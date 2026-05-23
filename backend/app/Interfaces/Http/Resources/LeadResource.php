<?php

namespace App\Interfaces\Http\Resources;

use App\Domain\Lead\Lead;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Lead */
class LeadResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'property_id' => $this->property_id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'message' => $this->message,
            'source' => $this->source,
            'status' => $this->status?->value,
            'status_label' => $this->status?->label(),
            'converted_to_reservation_id' => $this->converted_to_reservation_id,
            'property' => $this->whenLoaded('property', fn () => [
                'id' => $this->property->id,
                'title' => $this->property->title,
                'slug' => $this->property->slug,
                'city' => $this->property->city,
                'state' => $this->property->state,
                'property_type' => $this->property->property_type?->value,
                'property_type_label' => $this->property->property_type?->label(),
                'price_per_night' => $this->property->price_per_night,
            ]),
            'converted_to_reservation' => $this->whenLoaded('convertedToReservation', fn () => [
                'id' => $this->convertedToReservation->id,
                'check_in' => $this->convertedToReservation->check_in?->toDateString(),
                'check_out' => $this->convertedToReservation->check_out?->toDateString(),
                'status' => $this->convertedToReservation->status?->value,
                'total_price' => $this->convertedToReservation->total_price,
            ]),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
