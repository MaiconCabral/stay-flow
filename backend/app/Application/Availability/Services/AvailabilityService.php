<?php

namespace App\Application\Availability\Services;

use App\Application\Availability\DTOs\AvailabilityData;
use App\Application\Availability\UseCases\CreateAvailabilityUseCase;
use App\Application\Availability\UseCases\ManageAvailabilityUseCase;
use App\Application\Availability\UseCases\UpdateAvailabilityUseCase;
use App\Domain\Availability\Availability;
use Illuminate\Pagination\LengthAwarePaginator;

class AvailabilityService
{
    public function __construct(
        private readonly CreateAvailabilityUseCase $createAvailabilityUseCase,
        private readonly UpdateAvailabilityUseCase $updateAvailabilityUseCase,
        private readonly ManageAvailabilityUseCase $manageAvailabilityUseCase,
    ) {}

    public function create(AvailabilityData $data): Availability
    {
        return $this->createAvailabilityUseCase->execute($data);
    }

    public function update(int $id, AvailabilityData $data): Availability
    {
        return $this->updateAvailabilityUseCase->execute($id, $data);
    }

    public function find(int $id): Availability
    {
        return $this->manageAvailabilityUseCase->find($id);
    }

    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->manageAvailabilityUseCase->list($filters, $perPage);
    }

    public function findByProperty(int $propertyId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->manageAvailabilityUseCase->findByProperty($propertyId, $filters, $perPage);
    }

    public function delete(int $id): void
    {
        $this->manageAvailabilityUseCase->delete($id);
    }

    public function checkAvailability(
        int $propertyId,
        string $startDate,
        string $endDate,
    ): array {
        return $this->manageAvailabilityUseCase->checkAvailability($propertyId, $startDate, $endDate);
    }
}
