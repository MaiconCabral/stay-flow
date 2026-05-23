<?php

namespace App\Application\Message\DTOs;

readonly class StartConversationData
{
    public function __construct(
        public int $propertyId,
        public int $guestId,
        public ?int $reservationId = null,
        public string $content = '',
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            propertyId: (int) $data['property_id'],
            guestId: (int) $data['guest_id'],
            reservationId: isset($data['reservation_id']) ? (int) $data['reservation_id'] : null,
            content: $data['content'] ?? '',
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'property_id' => $this->propertyId,
            'guest_id' => $this->guestId,
            'reservation_id' => $this->reservationId,
            'content' => $this->content,
        ], fn ($val) => $val !== null);
    }
}
