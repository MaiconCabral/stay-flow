<?php

namespace App\Application\Availability\UseCases;

use App\Application\Availability\DTOs\AvailabilityData;
use App\Domain\Availability\Availability;
use App\Domain\Availability\Repositories\AvailabilityRepositoryInterface;
use RuntimeException;

class UpdateAvailabilityUseCase
{
    public function __construct(
        private readonly AvailabilityRepositoryInterface $availabilityRepository,
    ) {}

    public function execute(int $id, AvailabilityData $data): Availability
    {
        $availability = $this->availabilityRepository->findById($id);

        if ($availability === null) {
            throw new RuntimeException('Availability not found.');
        }

        if ($data->startDate !== null) {
            $availability->start_date = $data->startDate;
        }

        if ($data->endDate !== null) {
            $availability->end_date = $data->endDate;
        }

        if ($data->startDate !== null || $data->endDate !== null) {
            $start = $availability->start_date->format('Y-m-d');
            $end = $availability->end_date->format('Y-m-d');
            if ($start > $end) {
                throw new RuntimeException('Start date must be before or equal to end date.');
            }
        }

        if ($data->isAvailable !== null) {
            $availability->is_available = $data->isAvailable;
        }

        if ($data->price !== null) {
            $availability->price = $data->price;
        }

        $this->availabilityRepository->save($availability);

        return $availability;
    }
}
