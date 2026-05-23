<?php

namespace App\Application\Review\DTOs;

readonly class ReviewData
{
    public function __construct(
        public ?int $propertyId = null,
        public ?int $guestId = null,
        public ?int $reservationId = null,
        public ?int $rating = null,
        public ?string $comment = null,
        public ?string $hostReply = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            propertyId: isset($data['property_id']) ? (int) $data['property_id'] : null,
            guestId: isset($data['guest_id']) ? (int) $data['guest_id'] : null,
            reservationId: isset($data['reservation_id']) ? (int) $data['reservation_id'] : null,
            rating: isset($data['rating']) ? (int) $data['rating'] : null,
            comment: $data['comment'] ?? null,
            hostReply: $data['host_reply'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'property_id' => $this->propertyId,
            'guest_id' => $this->guestId,
            'reservation_id' => $this->reservationId,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'host_reply' => $this->hostReply,
        ], fn ($val) => $val !== null);
    }
}
