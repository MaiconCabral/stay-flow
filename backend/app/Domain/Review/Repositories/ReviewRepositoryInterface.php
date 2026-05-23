<?php

namespace App\Domain\Review\Repositories;

use App\Domain\Review\Review;
use Illuminate\Pagination\LengthAwarePaginator;

interface ReviewRepositoryInterface
{
    public function findById(int $id): ?Review;

    public function findByReservation(int $reservationId): ?Review;

    public function save(Review $review): Review;

    public function delete(Review $review): void;

    public function paginateByProperty(int $propertyId, int $perPage = 15): LengthAwarePaginator;

    public function averageRating(int $propertyId): float;

    public function countByProperty(int $propertyId): int;
}
