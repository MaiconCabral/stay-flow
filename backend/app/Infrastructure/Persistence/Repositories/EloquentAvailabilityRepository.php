<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Availability\Availability;
use App\Domain\Availability\Repositories\AvailabilityRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentAvailabilityRepository implements AvailabilityRepositoryInterface
{
    public function findById(int $id): ?Availability
    {
        return Availability::with(['property'])->find($id);
    }

    public function save(Availability $availability): Availability
    {
        $availability->save();
        return $availability;
    }

    public function delete(Availability $availability): void
    {
        $availability->delete();
    }

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Availability::query()->with(['property']);

        $this->applyFilters($query, $filters);

        $sortField = $filters['sort_field'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        return $query->paginate($perPage);
    }

    public function findByProperty(int $propertyId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Availability::query()->with(['property']);
        $query->where('property_id', $propertyId);
        $this->applyFilters($query, $filters);

        $sortField = $filters['sort_field'] ?? 'start_date';
        $sortDirection = $filters['sort_direction'] ?? 'asc';
        $query->orderBy($sortField, $sortDirection);

        return $query->paginate($perPage);
    }

    public function findOverlapping(
        int $propertyId,
        string $startDate,
        string $endDate,
        ?int $excludeId = null,
    ): array {
        return $this->buildOverlapQuery($propertyId, $startDate, $endDate, $excludeId)->get()->all();
    }

    public function hasOverlapping(
        int $propertyId,
        string $startDate,
        string $endDate,
        ?int $excludeId = null,
    ): bool {
        return $this->buildOverlapQuery($propertyId, $startDate, $endDate, $excludeId)->exists();
    }

    private function buildOverlapQuery(int $propertyId, string $startDate, string $endDate, ?int $excludeId = null)
    {
        $query = Availability::where('property_id', $propertyId)
            ->where(function ($q) use ($startDate, $endDate) {
                $q->where(function ($q) use ($startDate, $endDate) {
                    $q->where('start_date', '<=', $endDate)
                      ->where('end_date', '>=', $startDate);
                });
            });

        if ($excludeId !== null) {
            $query->where('id', '!=', $excludeId);
        }

        return $query;
    }

    private function applyFilters($query, array $filters): void
    {
        if (! empty($filters['property_id'])) {
            $query->where('property_id', $filters['property_id']);
        }

        if (isset($filters['is_available'])) {
            $query->where('is_available', filter_var($filters['is_available'], FILTER_VALIDATE_BOOLEAN));
        }

        if (! empty($filters['date_from'])) {
            $query->where('end_date', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('start_date', '<=', $filters['date_to']);
        }

        if (! empty($filters['price_min'])) {
            $query->where('price', '>=', $filters['price_min']);
        }

        if (! empty($filters['price_max'])) {
            $query->where('price', '<=', $filters['price_max']);
        }
    }
}
