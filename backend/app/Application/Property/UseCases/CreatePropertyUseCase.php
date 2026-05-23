<?php

namespace App\Application\Property\UseCases;

use App\Application\Property\DTOs\PropertyData;
use App\Domain\Property\Events\PropertyCreated;
use App\Domain\Property\Property;
use App\Domain\Property\Repositories\PropertyRepositoryInterface;
use App\Domain\User\Repositories\UserRepositoryInterface;
use Illuminate\Support\Str;
use RuntimeException;

class CreatePropertyUseCase
{
    public function __construct(
        private readonly PropertyRepositoryInterface $propertyRepository,
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function execute(PropertyData $data): Property
    {
        $host = $this->userRepository->findById($data->hostId);

        if ($host === null) {
            throw new RuntimeException('Host not found.');
        }

        $slug = $data->slug ?? Str::slug($data->title);

        if ($this->propertyRepository->findBySlug($slug) !== null) {
            throw new RuntimeException('Slug already in use.');
        }

        $property = new Property();
        $property->host_id = $data->hostId;
        $property->title = $data->title;
        $property->slug = $slug;
        $property->type = $data->type ?? 'entire_place';
        $property->description = $data->description;
        $property->address = $data->address;
        $property->city = $data->city;
        $property->state = $data->state;
        $property->country = $data->country;
        $property->zip_code = $data->zipCode;
        $property->property_type = $data->propertyType;
        $property->price_per_night = $data->pricePerNight;
        $property->cleaning_fee = $data->cleaningFee ?? 0;
        $property->max_guests = $data->maxGuests;
        $property->bedrooms = $data->bedrooms;
        $property->bathrooms = $data->bathrooms;
        $property->latitude = $data->latitude;
        $property->longitude = $data->longitude;
        $property->status = $data->status ?? 'available';
        $property->check_in_time = $data->checkInTime ?? '14:00:00';
        $property->check_out_time = $data->checkOutTime ?? '11:00:00';

        $this->propertyRepository->save($property);

        return $property;
    }
}
