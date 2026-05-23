<?php

namespace App\Domain\Reservation\Repositories;

use App\Domain\Reservation\Reservation;
use Illuminate\Pagination\LengthAwarePaginator;

interface ReservationRepositoryInterface
{
    public function findById(int $id): ?Reservation;

    public function save(Reservation $reservation): Reservation;

    public function delete(Reservation $reservation): void;

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findByGuest(int $guestId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findByProperty(int $propertyId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function hasOverlappingDates(int $propertyId, string $checkIn, string $checkOut, ?int $excludeId = null): bool;

    public function findOverlapping(int $propertyId, string $checkIn, string $checkOut, ?int $excludeId = null): array;
}
