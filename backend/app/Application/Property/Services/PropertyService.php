<?php

namespace App\Application\Property\Services;

use App\Application\Property\DTOs\PropertyData;
use App\Application\Property\UseCases\CreatePropertyUseCase;
use App\Application\Property\UseCases\ManagePropertyUseCase;
use App\Application\Property\UseCases\UpdatePropertyUseCase;
use App\Domain\Property\Property;
use Illuminate\Pagination\LengthAwarePaginator;

class PropertyService
{
    public function __construct(
        private readonly CreatePropertyUseCase $createPropertyUseCase,
        private readonly UpdatePropertyUseCase $updatePropertyUseCase,
        private readonly ManagePropertyUseCase $managePropertyUseCase,
    ) {}

    public function create(PropertyData $data): Property
    {
        return $this->createPropertyUseCase->execute($data);
    }

    public function update(int $id, PropertyData $data): Property
    {
        return $this->updatePropertyUseCase->execute($id, $data);
    }

    public function find(int $id): Property
    {
        return $this->managePropertyUseCase->find($id);
    }

    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->managePropertyUseCase->list($filters, $perPage);
    }

    public function findByHost(int $hostId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->managePropertyUseCase->findByHost($hostId, $filters, $perPage);
    }

    public function delete(int $id): void
    {
        $this->managePropertyUseCase->delete($id);
    }

    public function locations(?string $search = null): array
    {
        return $this->managePropertyUseCase->getLocations($search);
    }
}
