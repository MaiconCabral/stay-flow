<?php

namespace App\Application\Property\UseCases;

use App\Domain\Property\Events\PropertyDeleted;
use App\Domain\Property\Property;
use App\Domain\Property\Repositories\PropertyRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use RuntimeException;

class ManagePropertyUseCase
{
    public function __construct(
        private readonly PropertyRepositoryInterface $propertyRepository,
    ) {}

    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->propertyRepository->paginate($filters, $perPage);
    }

    public function findByHost(int $hostId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->propertyRepository->findByHost($hostId, $filters, $perPage);
    }

    public function find(int $id): Property
    {
        $property = $this->propertyRepository->findById($id);

        if ($property === null) {
            throw new RuntimeException('Property not found.');
        }

        return $property;
    }

    public function delete(int $id): void
    {
        $property = $this->propertyRepository->findById($id);

        if ($property === null) {
            throw new RuntimeException('Property not found.');
        }

        $this->propertyRepository->delete($property);
    }

    public function getLocations(?string $search = null): array
    {
        return $this->propertyRepository->getDistinctLocations($search);
    }
}
