<?php

namespace App\Application\Review\UseCases;

use App\Application\Review\DTOs\ReviewData;
use App\Domain\Review\Review;
use App\Domain\Review\Repositories\ReviewRepositoryInterface;
use App\Domain\Reservation\Reservation;
use App\Domain\Reservation\Repositories\ReservationRepositoryInterface;
use RuntimeException;

class CreateReviewUseCase
{
    public function __construct(
        private readonly ReviewRepositoryInterface $reviewRepository,
        private readonly ReservationRepositoryInterface $reservationRepository,
    ) {}

    public function execute(ReviewData $data): Review
    {
        $reservation = $this->reservationRepository->findById($data->reservationId);

        if ($reservation === null) {
            throw new RuntimeException('Reservation not found.');
        }

        if ($reservation->guest_id !== $data->guestId) {
            throw new RuntimeException('You can only review your own reservations.');
        }

        if ($reservation->status->value !== 'completed') {
            throw new RuntimeException('You can only review completed reservations.');
        }

        if ($this->reviewRepository->findByReservation($data->reservationId) !== null) {
            throw new RuntimeException('You have already reviewed this reservation.');
        }

        $review = new Review();
        $review->property_id = $data->propertyId;
        $review->guest_id = $data->guestId;
        $review->reservation_id = $data->reservationId;
        $review->rating = $data->rating;
        $review->comment = $data->comment;

        $this->reviewRepository->save($review);

        return $review;
    }
}
