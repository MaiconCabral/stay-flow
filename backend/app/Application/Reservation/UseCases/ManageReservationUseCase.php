<?php

namespace App\Application\Reservation\UseCases;

use App\Domain\Reservation\Reservation;
use App\Domain\Reservation\Repositories\ReservationRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use RuntimeException;

class ManageReservationUseCase
{
    public function __construct(
        private readonly ReservationRepositoryInterface $reservationRepository,
    ) {}

    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->reservationRepository->paginate($filters, $perPage);
    }

    public function findByGuest(int $guestId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->reservationRepository->findByGuest($guestId, $filters, $perPage);
    }

    public function findByProperty(int $propertyId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->reservationRepository->findByProperty($propertyId, $filters, $perPage);
    }

    public function find(int $id): Reservation
    {
        $reservation = $this->reservationRepository->findById($id);

        if ($reservation === null) {
            throw new RuntimeException('Reservation not found.');
        }

        return $reservation;
    }

    public function delete(int $id): void
    {
        $reservation = $this->reservationRepository->findById($id);

        if ($reservation === null) {
            throw new RuntimeException('Reservation not found.');
        }

        $this->reservationRepository->delete($reservation);
    }
}
