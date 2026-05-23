<?php

namespace App\Interfaces\Http\Resources;

use App\Domain\Reservation\Reservation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Reservation */
class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'property_id' => $this->property_id,
            'guest_id' => $this->guest_id,
            'check_in' => $this->check_in?->toDateString(),
            'check_out' => $this->check_out?->toDateString(),
            'total_guests' => $this->total_guests,
            'subtotal' => $this->subtotal,
            'service_fee' => $this->service_fee,
            'cleaning_fee' => $this->cleaning_fee,
            'total_price' => $this->total_price,
            'status' => $this->status?->value,
            'status_label' => $this->status?->label(),
            'cancelled_at' => $this->cancelled_at?->toISOString(),
            'cancelled_reason' => $this->cancelled_reason,
            'notes' => $this->notes,
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
                'cover_image' => $this->when($this->property->relationLoaded('coverImage') && $this->property->coverImage, fn () => [
                    'id' => $this->property->coverImage->id,
                    'image_url' => $this->property->coverImage->image_url,
                ]),
            ]),
            'guest' => $this->whenLoaded('guest', fn () => [
                'id' => $this->guest->id,
                'name' => $this->guest->name,
                'email' => $this->guest->email,
                'avatar' => $this->guest->avatar,
            ]),
            'payment' => $this->whenLoaded('payment', fn () => [
                'id' => $this->payment->id,
                'amount' => $this->payment->amount,
                'status' => $this->payment->status?->value,
                'payment_method' => $this->payment->payment_method?->value,
            ]),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
