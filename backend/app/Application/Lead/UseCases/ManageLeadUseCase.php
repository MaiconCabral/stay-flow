<?php

namespace App\Application\Lead\UseCases;

use App\Domain\Lead\Lead;
use App\Domain\Lead\Repositories\LeadRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use RuntimeException;

class ManageLeadUseCase
{
    public function __construct(
        private readonly LeadRepositoryInterface $leadRepository,
    ) {}

    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->leadRepository->paginate($filters, $perPage);
    }

    public function findByProperty(int $propertyId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->leadRepository->findByProperty($propertyId, $filters, $perPage);
    }

    public function findByStatus(string $status, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->leadRepository->findByStatus($status, $filters, $perPage);
    }

    public function find(int $id): Lead
    {
        $lead = $this->leadRepository->findById($id);

        if ($lead === null) {
            throw new RuntimeException('Lead not found.');
        }

        return $lead;
    }

    public function delete(int $id): void
    {
        $lead = $this->leadRepository->findById($id);

        if ($lead === null) {
            throw new RuntimeException('Lead not found.');
        }

        $this->leadRepository->delete($lead);
    }
}
