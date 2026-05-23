<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Review\Review;
use App\Domain\Review\Repositories\ReviewRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentReviewRepository implements ReviewRepositoryInterface
{
    public function findById(int $id): ?Review
    {
        return Review::with(['guest', 'property'])->find($id);
    }

    public function findByReservation(int $reservationId): ?Review
    {
        return Review::where('reservation_id', $reservationId)->first();
    }

    public function save(Review $review): Review
    {
        $review->save();
        return $review;
    }

    public function delete(Review $review): void
    {
        $review->delete();
    }

    public function paginateByProperty(int $propertyId, int $perPage = 15): LengthAwarePaginator
    {
        return Review::with('guest')
            ->where('property_id', $propertyId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function averageRating(int $propertyId): float
    {
        return (float) Review::where('property_id', $propertyId)
            ->avg('rating');
    }

    public function countByProperty(int $propertyId): int
    {
        return Review::where('property_id', $propertyId)->count();
    }
}
