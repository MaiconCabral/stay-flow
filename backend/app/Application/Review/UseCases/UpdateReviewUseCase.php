<?php

namespace App\Application\Review\UseCases;

use App\Application\Review\DTOs\ReviewData;
use App\Domain\Review\Review;
use App\Domain\Review\Repositories\ReviewRepositoryInterface;
use RuntimeException;

class UpdateReviewUseCase
{
    public function __construct(
        private readonly ReviewRepositoryInterface $reviewRepository,
    ) {}

    public function execute(int $id, ReviewData $data, int $guestId): Review
    {
        $review = $this->reviewRepository->findById($id);

        if ($review === null) {
            throw new RuntimeException('Review not found.');
        }

        if ($review->guest_id !== $guestId) {
            throw new RuntimeException('You can only edit your own reviews.');
        }

        if ($data->rating !== null) {
            $review->rating = $data->rating;
        }

        if ($data->comment !== null) {
            $review->comment = $data->comment;
        }

        if ($data->hostReply !== null) {
            $review->host_reply = $data->hostReply;
        }

        $this->reviewRepository->save($review);

        return $review;
    }
}
