<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Property\Property;
use App\Domain\Property\Repositories\PropertyRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentPropertyRepository implements PropertyRepositoryInterface
{
    public function findById(int $id): ?Property
    {
        return Property::find($id);
    }

    public function findBySlug(string $slug): ?Property
    {
        return Property::where('slug', $slug)->first();
    }

    public function save(Property $property): Property
    {
        $property->save();
        return $property;
    }

    public function delete(Property $property): void
    {
        $property->delete();
    }

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Property::query()->with('coverImage');

        $this->applyFilters($query, $filters);

        $sortField = $filters['sort_field'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        return $query->paginate($perPage);
    }

    public function findByHost(int $hostId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Property::query()->with('coverImage');
        $query->where('host_id', $hostId);
        $this->applyFilters($query, $filters);

        $sortField = $filters['sort_field'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        return $query->paginate($perPage);
    }

    private function applyFilters($query, array $filters): void
    {
        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('state', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['city'])) {
            $query->where('city', $filters['city']);
        }

        if (! empty($filters['state'])) {
            $query->where('state', $filters['state']);
        }

        if (! empty($filters['property_type'])) {
            $query->where('property_type', $filters['property_type']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['price_min'])) {
            $query->where('price_per_night', '>=', $filters['price_min']);
        }

        if (! empty($filters['price_max'])) {
            $query->where('price_per_night', '<=', $filters['price_max']);
        }

        if (! empty($filters['max_guests'])) {
            $query->where('max_guests', '>=', $filters['max_guests']);
        }

        if (! empty($filters['bedrooms'])) {
            $query->where('bedrooms', $filters['bedrooms']);
        }
    }
}
