<?php

namespace App\Domain\Property\Repositories;

use App\Domain\Property\Property;
use Illuminate\Pagination\LengthAwarePaginator;

interface PropertyRepositoryInterface
{
    public function findById(int $id): ?Property;

    public function findBySlug(string $slug): ?Property;

    public function save(Property $property): Property;

    public function delete(Property $property): void;

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findByHost(int $hostId, array $filters = [], int $perPage = 15): LengthAwarePaginator;
}
