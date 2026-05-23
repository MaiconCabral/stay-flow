<?php

namespace App\Application\Reservation\DTOs;

readonly class ReservationData
{
    public function __construct(
        public ?int $propertyId = null,
        public ?int $guestId = null,
        public ?string $checkIn = null,
        public ?string $checkOut = null,
        public ?int $totalGuests = null,
        public ?float $subtotal = null,
        public ?float $serviceFee = null,
        public ?float $cleaningFee = null,
        public ?float $totalPrice = null,
        public ?string $status = null,
        public ?string $cancelledAt = null,
        public ?string $cancelledReason = null,
        public ?string $notes = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            propertyId: isset($data['property_id']) ? (int) $data['property_id'] : null,
            guestId: isset($data['guest_id']) ? (int) $data['guest_id'] : null,
            checkIn: $data['check_in'] ?? null,
            checkOut: $data['check_out'] ?? null,
            totalGuests: isset($data['total_guests']) ? (int) $data['total_guests'] : null,
            subtotal: isset($data['subtotal']) ? (float) $data['subtotal'] : null,
            serviceFee: isset($data['service_fee']) ? (float) $data['service_fee'] : null,
            cleaningFee: isset($data['cleaning_fee']) ? (float) $data['cleaning_fee'] : null,
            totalPrice: isset($data['total_price']) ? (float) $data['total_price'] : null,
            status: $data['status'] ?? null,
            cancelledAt: $data['cancelled_at'] ?? null,
            cancelledReason: $data['cancelled_reason'] ?? null,
            notes: $data['notes'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'property_id' => $this->propertyId,
            'guest_id' => $this->guestId,
            'check_in' => $this->checkIn,
            'check_out' => $this->checkOut,
            'total_guests' => $this->totalGuests,
            'subtotal' => $this->subtotal,
            'service_fee' => $this->serviceFee,
            'cleaning_fee' => $this->cleaningFee,
            'total_price' => $this->totalPrice,
            'status' => $this->status,
            'cancelled_at' => $this->cancelledAt,
            'cancelled_reason' => $this->cancelledReason,
            'notes' => $this->notes,
        ], fn ($val) => $val !== null);
    }
}
