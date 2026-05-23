<?php

namespace App\Application\Availability\UseCases;

use App\Application\Availability\DTOs\AvailabilityData;
use App\Domain\Availability\Availability;
use App\Domain\Availability\Repositories\AvailabilityRepositoryInterface;
use App\Domain\Property\Repositories\PropertyRepositoryInterface;
use RuntimeException;

class CreateAvailabilityUseCase
{
    public function __construct(
        private readonly AvailabilityRepositoryInterface $availabilityRepository,
        private readonly PropertyRepositoryInterface $propertyRepository,
    ) {}

    public function execute(AvailabilityData $data): Availability
    {
        $property = $this->propertyRepository->findById($data->propertyId);

        if ($property === null) {
            throw new RuntimeException('Property not found.');
        }

        if ($data->startDate > $data->endDate) {
            throw new RuntimeException('Start date must be before or equal to end date.');
        }

        $availability = new Availability();
        $availability->property_id = $data->propertyId;
        $availability->start_date = $data->startDate;
        $availability->end_date = $data->endDate;
        $availability->is_available = $data->isAvailable ?? true;
        $availability->price = $data->price;

        $this->availabilityRepository->save($availability);

        return $availability;
    }
}
