<?php

namespace App\Application\Lead\Services;

use App\Application\Lead\DTOs\LeadData;
use App\Application\Lead\UseCases\ConvertLeadUseCase;
use App\Application\Lead\UseCases\CreateLeadUseCase;
use App\Application\Lead\UseCases\ManageLeadUseCase;
use App\Application\Lead\UseCases\UpdateLeadUseCase;
use App\Domain\Lead\Lead;
use Illuminate\Pagination\LengthAwarePaginator;

class LeadService
{
    public function __construct(
        private readonly CreateLeadUseCase $createLeadUseCase,
        private readonly UpdateLeadUseCase $updateLeadUseCase,
        private readonly ManageLeadUseCase $manageLeadUseCase,
        private readonly ConvertLeadUseCase $convertLeadUseCase,
    ) {}

    public function create(LeadData $data): Lead
    {
        return $this->createLeadUseCase->execute($data);
    }

    public function update(int $id, LeadData $data): Lead
    {
        return $this->updateLeadUseCase->execute($id, $data);
    }

    public function find(int $id): Lead
    {
        return $this->manageLeadUseCase->find($id);
    }

    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->manageLeadUseCase->list($filters, $perPage);
    }

    public function findByProperty(int $propertyId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->manageLeadUseCase->findByProperty($propertyId, $filters, $perPage);
    }

    public function findByStatus(string $status, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->manageLeadUseCase->findByStatus($status, $filters, $perPage);
    }

    public function delete(int $id): void
    {
        $this->manageLeadUseCase->delete($id);
    }

    public function convert(int $id, ?int $reservationId = null): Lead
    {
        return $this->convertLeadUseCase->execute($id, $reservationId);
    }
}
