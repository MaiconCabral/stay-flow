<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Reservation\Reservation;
use App\Domain\Reservation\Repositories\ReservationRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentReservationRepository implements ReservationRepositoryInterface
{
    public function findById(int $id): ?Reservation
    {
        return Reservation::with(['property', 'guest', 'payment'])->find($id);
    }

    public function save(Reservation $reservation): Reservation
    {
        $reservation->save();
        return $reservation;
    }

    public function delete(Reservation $reservation): void
    {
        $reservation->delete();
    }

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Reservation::query()->with(['property', 'guest']);

        $this->applyFilters($query, $filters);

        $sortField = $filters['sort_field'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        return $query->paginate($perPage);
    }

    public function findByGuest(int $guestId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Reservation::query()->with(['property', 'guest']);
        $query->where('guest_id', $guestId);
        $this->applyFilters($query, $filters);

        $sortField = $filters['sort_field'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        return $query->paginate($perPage);
    }

    public function findByProperty(int $propertyId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Reservation::query()->with(['guest']);
        $query->where('property_id', $propertyId);
        $this->applyFilters($query, $filters);

        $sortField = $filters['sort_field'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        return $query->paginate($perPage);
    }

    public function hasOverlappingDates(int $propertyId, string $checkIn, string $checkOut, ?int $excludeId = null): bool
    {
        return $this->buildOverlapQuery($propertyId, $checkIn, $checkOut, $excludeId)->exists();
    }

    public function findOverlapping(int $propertyId, string $checkIn, string $checkOut, ?int $excludeId = null): array
    {
        return $this->buildOverlapQuery($propertyId, $checkIn, $checkOut, $excludeId)->get()->all();
    }

    private function buildOverlapQuery(int $propertyId, string $checkIn, string $checkOut, ?int $excludeId = null)
    {
        $query = Reservation::where('property_id', $propertyId)
            ->where('status', '!=', 'cancelled')
            ->where(function ($q) use ($checkIn, $checkOut) {
                $q->where(function ($q) use ($checkIn, $checkOut) {
                    $q->where('check_in', '<', $checkOut)
                      ->where('check_out', '>', $checkIn);
                });
            });

        if ($excludeId !== null) {
            $query->where('id', '!=', $excludeId);
        }

        return $query;
    }

    private function applyFilters($query, array $filters): void
    {
        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['property_id'])) {
            $query->where('property_id', $filters['property_id']);
        }

        if (! empty($filters['property_ids'])) {
            $query->whereIn('property_id', $filters['property_ids']);
        }

        if (! empty($filters['guest_id'])) {
            $query->where('guest_id', $filters['guest_id']);
        }

        if (! empty($filters['check_in_from'])) {
            $query->where('check_in', '>=', $filters['check_in_from']);
        }

        if (! empty($filters['check_in_to'])) {
            $query->where('check_in', '<=', $filters['check_in_to']);
        }

        if (! empty($filters['check_out_from'])) {
            $query->where('check_out', '>=', $filters['check_out_from']);
        }

        if (! empty($filters['check_out_to'])) {
            $query->where('check_out', '<=', $filters['check_out_to']);
        }

        if (! empty($filters['date_from'])) {
            $query->where('check_in', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('check_out', '<=', $filters['date_to']);
        }

        if (! empty($filters['price_min'])) {
            $query->where('total_price', '>=', $filters['price_min']);
        }

        if (! empty($filters['price_max'])) {
            $query->where('total_price', '<=', $filters['price_max']);
        }
    }
}
