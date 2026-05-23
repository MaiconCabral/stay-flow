<?php

namespace App\Application\Availability\DTOs;

readonly class AvailabilityData
{
    public function __construct(
        public ?int $propertyId = null,
        public ?string $startDate = null,
        public ?string $endDate = null,
        public ?bool $isAvailable = null,
        public ?float $price = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            propertyId: isset($data['property_id']) ? (int) $data['property_id'] : null,
            startDate: $data['start_date'] ?? null,
            endDate: $data['end_date'] ?? null,
            isAvailable: isset($data['is_available']) ? (bool) $data['is_available'] : null,
            price: isset($data['price']) ? (float) $data['price'] : null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'property_id' => $this->propertyId,
            'start_date' => $this->startDate,
            'end_date' => $this->endDate,
            'is_available' => $this->isAvailable,
            'price' => $this->price,
        ], fn ($val) => $val !== null);
    }
}
