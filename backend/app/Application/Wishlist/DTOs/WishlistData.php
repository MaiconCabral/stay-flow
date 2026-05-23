<?php

namespace App\Application\Wishlist\DTOs;

readonly class WishlistData
{
    public function __construct(
        public int $userId,
        public int $propertyId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            userId: (int) $data['user_id'],
            propertyId: (int) $data['property_id'],
        );
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'property_id' => $this->propertyId,
        ];
    }
}
