<?php

namespace App\Application\Reservation\UseCases;

use App\Domain\Reservation\Events\ReservationCancelled;
use App\Domain\Reservation\Reservation;
use App\Domain\Reservation\Repositories\ReservationRepositoryInterface;
use RuntimeException;

class CancelReservationUseCase
{
    public function __construct(
        private readonly ReservationRepositoryInterface $reservationRepository,
    ) {}

    public function execute(int $id, string $reason): Reservation
    {
        $reservation = $this->reservationRepository->findById($id);

        if ($reservation === null) {
            throw new RuntimeException('Reservation not found.');
        }

        if ($reservation->status->value === 'cancelled') {
            throw new RuntimeException('Reservation is already cancelled.');
        }

        if ($reservation->status->value === 'completed') {
            throw new RuntimeException('Cannot cancel a completed reservation.');
        }

        $reservation->status = 'cancelled';
        $reservation->cancelled_at = now();
        $reservation->cancelled_reason = $reason;

        $this->reservationRepository->save($reservation);

        event(new ReservationCancelled($reservation));

        return $reservation;
    }
}
