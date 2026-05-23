<?php

namespace App\Application\Property\DTOs;

readonly class PropertyData
{
    public function __construct(
        public ?int $hostId = null,
        public ?string $title = null,
        public ?string $slug = null,
        public ?string $type = null,
        public ?string $description = null,
        public ?string $address = null,
        public ?string $city = null,
        public ?string $state = null,
        public ?string $country = null,
        public ?string $zipCode = null,
        public ?string $propertyType = null,
        public ?float $pricePerNight = null,
        public ?float $cleaningFee = null,
        public ?int $maxGuests = null,
        public ?int $bedrooms = null,
        public ?int $bathrooms = null,
        public ?float $latitude = null,
        public ?float $longitude = null,
        public ?string $status = null,
        public ?string $checkInTime = null,
        public ?string $checkOutTime = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            hostId: isset($data['host_id']) ? (int) $data['host_id'] : null,
            title: $data['title'] ?? null,
            slug: $data['slug'] ?? null,
            type: $data['type'] ?? null,
            description: $data['description'] ?? null,
            address: $data['address'] ?? null,
            city: $data['city'] ?? null,
            state: $data['state'] ?? null,
            country: $data['country'] ?? null,
            zipCode: $data['zip_code'] ?? null,
            propertyType: $data['property_type'] ?? null,
            pricePerNight: isset($data['price_per_night']) ? (float) $data['price_per_night'] : null,
            cleaningFee: isset($data['cleaning_fee']) ? (float) $data['cleaning_fee'] : null,
            maxGuests: isset($data['max_guests']) ? (int) $data['max_guests'] : null,
            bedrooms: isset($data['bedrooms']) ? (int) $data['bedrooms'] : null,
            bathrooms: isset($data['bathrooms']) ? (int) $data['bathrooms'] : null,
            latitude: isset($data['latitude']) ? (float) $data['latitude'] : null,
            longitude: isset($data['longitude']) ? (float) $data['longitude'] : null,
            status: $data['status'] ?? null,
            checkInTime: $data['check_in_time'] ?? null,
            checkOutTime: $data['check_out_time'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'host_id' => $this->hostId,
            'title' => $this->title,
            'slug' => $this->slug,
            'type' => $this->type,
            'description' => $this->description,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'zip_code' => $this->zipCode,
            'property_type' => $this->propertyType,
            'price_per_night' => $this->pricePerNight,
            'cleaning_fee' => $this->cleaningFee,
            'max_guests' => $this->maxGuests,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'status' => $this->status,
            'check_in_time' => $this->checkInTime,
            'check_out_time' => $this->checkOutTime,
        ], fn ($val) => $val !== null);
    }
}
