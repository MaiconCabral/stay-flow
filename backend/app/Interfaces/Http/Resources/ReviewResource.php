<?php

namespace App\Interfaces\Http\Resources;

use App\Domain\Review\Review;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Review */
class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'property_id' => $this->property_id,
            'guest_id' => $this->guest_id,
            'reservation_id' => $this->reservation_id,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'host_reply' => $this->host_reply,
            'guest' => $this->whenLoaded('guest', fn () => [
                'id' => $this->guest->id,
                'name' => $this->guest->name,
                'avatar' => $this->guest->avatar,
            ]),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
