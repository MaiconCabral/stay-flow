<?php

namespace App\Application\Review\UseCases;

use App\Domain\Review\Events\ReviewDeleted;
use App\Domain\Review\Review;
use App\Domain\Review\Repositories\ReviewRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use RuntimeException;

class ManageReviewUseCase
{
    public function __construct(
        private readonly ReviewRepositoryInterface $reviewRepository,
    ) {}

    public function find(int $id): Review
    {
        $review = $this->reviewRepository->findById($id);

        if ($review === null) {
            throw new RuntimeException('Review not found.');
        }

        return $review;
    }

    public function findByProperty(int $propertyId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->reviewRepository->paginateByProperty($propertyId, $perPage);
    }

    public function delete(int $id, int $guestId): void
    {
        $review = $this->reviewRepository->findById($id);

        if ($review === null) {
            throw new RuntimeException('Review not found.');
        }

        if ($review->guest_id !== $guestId) {
            throw new RuntimeException('You can only delete your own reviews.');
        }

        $this->reviewRepository->delete($review);
    }

    public function averageRating(int $propertyId): float
    {
        return $this->reviewRepository->averageRating($propertyId);
    }
}
