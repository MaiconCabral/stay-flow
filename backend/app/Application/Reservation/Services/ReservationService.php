<?php

namespace App\Application\Reservation\Services;

use App\Application\Reservation\DTOs\ReservationData;
use App\Application\Reservation\UseCases\CancelReservationUseCase;
use App\Application\Reservation\UseCases\CreateReservationUseCase;
use App\Application\Reservation\UseCases\ManageReservationUseCase;
use App\Application\Reservation\UseCases\UpdateReservationUseCase;
use App\Domain\Reservation\Reservation;
use Illuminate\Pagination\LengthAwarePaginator;

class ReservationService
{
    public function __construct(
        private readonly CreateReservationUseCase $createReservationUseCase,
        private readonly UpdateReservationUseCase $updateReservationUseCase,
        private readonly ManageReservationUseCase $manageReservationUseCase,
        private readonly CancelReservationUseCase $cancelReservationUseCase,
    ) {}

    public function create(ReservationData $data): Reservation
    {
        return $this->createReservationUseCase->execute($data);
    }

    public function update(int $id, ReservationData $data): Reservation
    {
        return $this->updateReservationUseCase->execute($id, $data);
    }

    public function find(int $id): Reservation
    {
        return $this->manageReservationUseCase->find($id);
    }

    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->manageReservationUseCase->list($filters, $perPage);
    }

    public function findByGuest(int $guestId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->manageReservationUseCase->findByGuest($guestId, $filters, $perPage);
    }

    public function findByProperty(int $propertyId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->manageReservationUseCase->findByProperty($propertyId, $filters, $perPage);
    }

    public function delete(int $id): void
    {
        $this->manageReservationUseCase->delete($id);
    }

    public function cancel(int $id, string $reason): Reservation
    {
        return $this->cancelReservationUseCase->execute($id, $reason);
    }
}
