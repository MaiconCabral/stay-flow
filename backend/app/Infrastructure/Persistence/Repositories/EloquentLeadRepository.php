<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Lead\Lead;
use App\Domain\Lead\Repositories\LeadRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentLeadRepository implements LeadRepositoryInterface
{
    public function findById(int $id): ?Lead
    {
        return Lead::with(['property', 'convertedToReservation'])->find($id);
    }

    public function save(Lead $lead): Lead
    {
        $lead->save();
        return $lead;
    }

    public function delete(Lead $lead): void
    {
        $lead->delete();
    }

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Lead::query()->with(['property']);
        $this->applyFilters($query, $filters);

        $sortField = $filters['sort_field'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        return $query->paginate($perPage);
    }

    public function findByProperty(int $propertyId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Lead::query()->with(['property']);
        $query->where('property_id', $propertyId);
        $this->applyFilters($query, $filters);

        $sortField = $filters['sort_field'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        return $query->paginate($perPage);
    }

    public function findByStatus(string $status, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Lead::query()->with(['property']);
        $query->where('status', $status);
        $this->applyFilters($query, $filters);

        $sortField = $filters['sort_field'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        return $query->paginate($perPage);
    }

    private function applyFilters($query, array $filters): void
    {
        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['property_id'])) {
            $query->where('property_id', $filters['property_id']);
        }

        if (! empty($filters['source'])) {
            $query->where('source', $filters['source']);
        }

        if (! empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to']);
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }
    }
}
