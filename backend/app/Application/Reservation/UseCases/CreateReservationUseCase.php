<?php

namespace App\Application\Reservation\UseCases;

use App\Application\Reservation\DTOs\ReservationData;
use App\Domain\Property\Repositories\PropertyRepositoryInterface;
use App\Domain\Reservation\Events\ReservationCancelled;
use App\Domain\Reservation\Reservation;
use App\Domain\Reservation\Repositories\ReservationRepositoryInterface;
use App\Domain\Reservation\ValueObjects\DateRange;
use App\Domain\User\Repositories\UserRepositoryInterface;
use RuntimeException;

class CreateReservationUseCase
{
    public function __construct(
        private readonly ReservationRepositoryInterface $reservationRepository,
        private readonly PropertyRepositoryInterface $propertyRepository,
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function execute(ReservationData $data): Reservation
    {
        $property = $this->propertyRepository->findById($data->propertyId);

        if ($property === null) {
            throw new RuntimeException('Property not found.');
        }

        $guest = $this->userRepository->findById($data->guestId);

        if ($guest === null) {
            throw new RuntimeException('Guest not found.');
        }

        $dateRange = new DateRange($data->checkIn, $data->checkOut);

        if ($data->totalGuests > $property->max_guests) {
            throw new RuntimeException("Property can only accommodate up to {$property->max_guests} guests.");
        }

        if ($this->reservationRepository->hasOverlappingDates($property->id, $data->checkIn, $data->checkOut)) {
            throw new RuntimeException('Property is not available for the selected dates.');
        }

        $nights = $dateRange->nights();
        $subtotal = $data->subtotal ?? ($property->price_per_night * $nights);
        $serviceFee = $data->serviceFee ?? round($subtotal * 0.10, 2);
        $cleaningFee = $data->cleaningFee ?? ($property->cleaning_fee ?? 0);
        $totalPrice = $data->totalPrice ?? ($subtotal + $serviceFee + $cleaningFee);

        $reservation = new Reservation();
        $reservation->property_id = $data->propertyId;
        $reservation->guest_id = $data->guestId;
        $reservation->check_in = $data->checkIn;
        $reservation->check_out = $data->checkOut;
        $reservation->total_guests = $data->totalGuests;
        $reservation->subtotal = $subtotal;
        $reservation->service_fee = $serviceFee;
        $reservation->cleaning_fee = $cleaningFee;
        $reservation->total_price = $totalPrice;
        $reservation->status = $data->status ?? 'pending';
        $reservation->notes = $data->notes;

        $this->reservationRepository->save($reservation);

        return $reservation;
    }
}
