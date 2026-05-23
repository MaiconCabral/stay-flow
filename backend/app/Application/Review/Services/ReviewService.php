<?php

namespace App\Application\Review\Services;

use App\Application\Review\DTOs\ReviewData;
use App\Application\Review\UseCases\CreateReviewUseCase;
use App\Application\Review\UseCases\ManageReviewUseCase;
use App\Application\Review\UseCases\UpdateReviewUseCase;
use App\Domain\Review\Review;
use Illuminate\Pagination\LengthAwarePaginator;

class ReviewService
{
    public function __construct(
        private readonly CreateReviewUseCase $createReviewUseCase,
        private readonly UpdateReviewUseCase $updateReviewUseCase,
        private readonly ManageReviewUseCase $manageReviewUseCase,
    ) {}

    public function create(ReviewData $data): Review
    {
        return $this->createReviewUseCase->execute($data);
    }

    public function update(int $id, ReviewData $data, int $guestId): Review
    {
        return $this->updateReviewUseCase->execute($id, $data, $guestId);
    }

    public function find(int $id): Review
    {
        return $this->manageReviewUseCase->find($id);
    }

    public function findByProperty(int $propertyId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->manageReviewUseCase->findByProperty($propertyId, $perPage);
    }

    public function delete(int $id, int $guestId): void
    {
        $this->manageReviewUseCase->delete($id, $guestId);
    }

    public function averageRating(int $propertyId): float
    {
        return $this->manageReviewUseCase->averageRating($propertyId);
    }
}
