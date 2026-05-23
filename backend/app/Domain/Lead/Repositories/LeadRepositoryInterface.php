<?php

namespace App\Domain\Lead\Repositories;

use App\Domain\Lead\Lead;
use Illuminate\Pagination\LengthAwarePaginator;

interface LeadRepositoryInterface
{
    public function findById(int $id): ?Lead;

    public function save(Lead $lead): Lead;

    public function delete(Lead $lead): void;

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findByProperty(int $propertyId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findByStatus(string $status, array $filters = [], int $perPage = 15): LengthAwarePaginator;
}
