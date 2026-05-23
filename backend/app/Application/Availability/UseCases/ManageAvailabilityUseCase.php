<?php

namespace App\Application\Availability\UseCases;

use App\Domain\Availability\Availability;
use App\Domain\Availability\Repositories\AvailabilityRepositoryInterface;
use App\Domain\Reservation\Repositories\ReservationRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use RuntimeException;

class ManageAvailabilityUseCase
{
    public function __construct(
        private readonly AvailabilityRepositoryInterface $availabilityRepository,
        private readonly ReservationRepositoryInterface $reservationRepository,
    ) {}

    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->availabilityRepository->paginate($filters, $perPage);
    }

    public function findByProperty(int $propertyId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->availabilityRepository->findByProperty($propertyId, $filters, $perPage);
    }

    public function find(int $id): Availability
    {
        $availability = $this->availabilityRepository->findById($id);

        if ($availability === null) {
            throw new RuntimeException('Availability not found.');
        }

        return $availability;
    }

    public function delete(int $id): void
    {
        $availability = $this->availabilityRepository->findById($id);

        if ($availability === null) {
            throw new RuntimeException('Availability not found.');
        }

        $this->availabilityRepository->delete($availability);
    }

    public function checkAvailability(
        int $propertyId,
        string $startDate,
        string $endDate,
    ): array {
        if ($startDate > $endDate) {
            throw new RuntimeException('Start date must be before or equal to end date.');
        }

        $overlappingBlocks = $this->availabilityRepository->findOverlapping(
            $propertyId, $startDate, $endDate,
        );

        $unavailableBlocks = array_filter(
            $overlappingBlocks,
            fn (Availability $block) => ! $block->is_available,
        );

        $hasReservationOverlap = $this->reservationRepository->hasOverlappingDates(
            $propertyId, $startDate, $endDate,
        );

        $isAvailable = empty($unavailableBlocks) && ! $hasReservationOverlap;

        return [
            'is_available' => $isAvailable,
            'property_id' => $propertyId,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'blocking_availability' => $isAvailable ? [] : array_values(array_map(
                fn (Availability $block) => [
                    'id' => $block->id,
                    'start_date' => $block->start_date->format('Y-m-d'),
                    'end_date' => $block->end_date->format('Y-m-d'),
                    'is_available' => $block->is_available,
                ],
                $unavailableBlocks,
            )),
            'has_reservation_overlap' => $hasReservationOverlap,
        ];
    }
}
