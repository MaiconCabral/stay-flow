<?php

namespace App\Application\Lead\DTOs;

readonly class LeadData
{
    public function __construct(
        public ?int $propertyId = null,
        public ?string $name = null,
        public ?string $email = null,
        public ?string $phone = null,
        public ?string $message = null,
        public ?string $source = null,
        public ?string $status = null,
        public ?int $convertedToReservationId = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            propertyId: isset($data['property_id']) ? (int) $data['property_id'] : null,
            name: $data['name'] ?? null,
            email: $data['email'] ?? null,
            phone: $data['phone'] ?? null,
            message: $data['message'] ?? null,
            source: $data['source'] ?? null,
            status: $data['status'] ?? null,
            convertedToReservationId: isset($data['converted_to_reservation_id']) ? (int) $data['converted_to_reservation_id'] : null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'property_id' => $this->propertyId,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'message' => $this->message,
            'source' => $this->source,
            'status' => $this->status,
            'converted_to_reservation_id' => $this->convertedToReservationId,
        ], fn ($val) => $val !== null);
    }
}
