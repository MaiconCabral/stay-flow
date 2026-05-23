<?php

namespace App\Application\Property\UseCases;

use App\Application\Property\DTOs\PropertyData;
use App\Domain\Property\Events\PropertyUpdated;
use App\Domain\Property\Property;
use App\Domain\Property\Repositories\PropertyRepositoryInterface;
use Illuminate\Support\Str;
use RuntimeException;

class UpdatePropertyUseCase
{
    public function __construct(
        private readonly PropertyRepositoryInterface $propertyRepository,
    ) {}

    public function execute(int $id, PropertyData $data): Property
    {
        $property = $this->propertyRepository->findById($id);

        if ($property === null) {
            throw new RuntimeException('Property not found.');
        }

        if ($data->slug !== null && $data->slug !== $property->slug) {
            $existing = $this->propertyRepository->findBySlug($data->slug);
            if ($existing !== null && $existing->id !== $property->id) {
                throw new RuntimeException('Slug already in use.');
            }
            $property->slug = $data->slug;
        }

        if ($data->title !== null) {
            $property->title = $data->title;
        }

        if ($data->type !== null) {
            $property->type = $data->type;
        }

        if ($data->description !== null) {
            $property->description = $data->description;
        }

        if ($data->address !== null) {
            $property->address = $data->address;
        }

        if ($data->city !== null) {
            $property->city = $data->city;
        }

        if ($data->state !== null) {
            $property->state = $data->state;
        }

        if ($data->country !== null) {
            $property->country = $data->country;
        }

        if ($data->zipCode !== null) {
            $property->zip_code = $data->zipCode;
        }

        if ($data->propertyType !== null) {
            $property->property_type = $data->propertyType;
        }

        if ($data->pricePerNight !== null) {
            $property->price_per_night = $data->pricePerNight;
        }

        if ($data->cleaningFee !== null) {
            $property->cleaning_fee = $data->cleaningFee;
        }

        if ($data->maxGuests !== null) {
            $property->max_guests = $data->maxGuests;
        }

        if ($data->bedrooms !== null) {
            $property->bedrooms = $data->bedrooms;
        }

        if ($data->bathrooms !== null) {
            $property->bathrooms = $data->bathrooms;
        }

        if ($data->latitude !== null) {
            $property->latitude = $data->latitude;
        }

        if ($data->longitude !== null) {
            $property->longitude = $data->longitude;
        }

        if ($data->status !== null) {
            $property->status = $data->status;
        }

        if ($data->checkInTime !== null) {
            $property->check_in_time = $data->checkInTime;
        }

        if ($data->checkOutTime !== null) {
            $property->check_out_time = $data->checkOutTime;
        }

        $this->propertyRepository->save($property);

        return $property;
    }
}
