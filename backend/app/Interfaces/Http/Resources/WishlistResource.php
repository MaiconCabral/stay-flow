<?php

namespace App\Interfaces\Http\Resources;

use App\Domain\Wishlist\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Wishlist */
class WishlistResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'property_id' => $this->property_id,
            'property' => $this->whenLoaded('property', fn () => new PropertyResource($this->property)),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
