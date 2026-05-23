<?php

namespace App\Application\Reservation\UseCases;

use App\Application\Reservation\DTOs\ReservationData;
use App\Domain\Property\Repositories\PropertyRepositoryInterface;
use App\Domain\Reservation\Reservation;
use App\Domain\Reservation\Repositories\ReservationRepositoryInterface;
use App\Domain\Reservation\ValueObjects\DateRange;
use RuntimeException;

class UpdateReservationUseCase
{
    public function __construct(
        private readonly ReservationRepositoryInterface $reservationRepository,
        private readonly PropertyRepositoryInterface $propertyRepository,
    ) {}

    public function execute(int $id, ReservationData $data): Reservation
    {
        $reservation = $this->reservationRepository->findById($id);

        if ($reservation === null) {
            throw new RuntimeException('Reservation not found.');
        }

        if ($reservation->status->value === 'cancelled') {
            throw new RuntimeException('Cannot update a cancelled reservation.');
        }

        if ($data->checkIn !== null) {
            $reservation->check_in = $data->checkIn;
        }

        if ($data->checkOut !== null) {
            $reservation->check_out = $data->checkOut;
        }

        if ($data->totalGuests !== null) {
            $property = $this->propertyRepository->findById($reservation->property_id);
            if ($data->totalGuests > $property->max_guests) {
                throw new RuntimeException("Property can only accommodate up to {$property->max_guests} guests.");
            }
            $reservation->total_guests = $data->totalGuests;
        }

        if ($data->subtotal !== null) {
            $reservation->subtotal = $data->subtotal;
        }

        if ($data->serviceFee !== null) {
            $reservation->service_fee = $data->serviceFee;
        }

        if ($data->cleaningFee !== null) {
            $reservation->cleaning_fee = $data->cleaningFee;
        }

        if ($data->totalPrice !== null) {
            $reservation->total_price = $data->totalPrice;
        }

        if ($data->notes !== null) {
            $reservation->notes = $data->notes;
        }

        $this->reservationRepository->save($reservation);

        return $reservation;
    }
}
