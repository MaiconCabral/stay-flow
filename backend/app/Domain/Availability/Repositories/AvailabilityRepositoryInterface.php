<?php

namespace App\Domain\Availability\Repositories;

use App\Domain\Availability\Availability;
use Illuminate\Pagination\LengthAwarePaginator;

interface AvailabilityRepositoryInterface
{
    public function findById(int $id): ?Availability;

    public function save(Availability $availability): Availability;

    public function delete(Availability $availability): void;

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findByProperty(int $propertyId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findOverlapping(
        int $propertyId,
        string $startDate,
        string $endDate,
        ?int $excludeId = null,
    ): array;

    public function hasOverlapping(
        int $propertyId,
        string $startDate,
        string $endDate,
        ?int $excludeId = null,
    ): bool;
}
