<?php

namespace App\Interfaces\Http\Resources;

use App\Domain\Property\Property;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Property */
class PropertyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'host_id' => $this->host_id,
            'title' => $this->title,
            'slug' => $this->slug,
            'type' => $this->type,
            'description' => $this->description,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'zip_code' => $this->zip_code,
            'property_type' => $this->property_type?->value,
            'property_type_label' => $this->property_type?->label(),
            'price_per_night' => $this->price_per_night,
            'cleaning_fee' => $this->cleaning_fee,
            'max_guests' => $this->max_guests,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'status' => $this->status?->value,
            'status_label' => $this->status?->label(),
            'check_in_time' => $this->check_in_time,
            'check_out_time' => $this->check_out_time,
            'cover_image' => $this->whenLoaded('coverImage', fn () => [
                'id' => $this->coverImage->id,
                'image_url' => $this->coverImage->image_url,
            ]),
            'images' => $this->whenLoaded('images', fn () =>
                $this->images->map(fn ($img) => [
                    'id' => $img->id,
                    'image_url' => $img->image_url,
                    'is_cover' => $img->is_cover,
                    'order' => $img->order,
                ])
            ),
            'host' => $this->whenLoaded('host', fn () => [
                'id' => $this->host->id,
                'name' => $this->host->name,
                'avatar' => $this->host->avatar,
            ]),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
