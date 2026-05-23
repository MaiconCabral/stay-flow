<?php

namespace App\Application\Lead\UseCases;

use App\Domain\Lead\Lead;
use App\Domain\Lead\Repositories\LeadRepositoryInterface;
use App\Domain\Reservation\Repositories\ReservationRepositoryInterface;
use RuntimeException;

class ConvertLeadUseCase
{
    public function __construct(
        private readonly LeadRepositoryInterface $leadRepository,
        private readonly ReservationRepositoryInterface $reservationRepository,
    ) {}

    public function execute(int $id, ?int $reservationId = null): Lead
    {
        $lead = $this->leadRepository->findById($id);

        if ($lead === null) {
            throw new RuntimeException('Lead not found.');
        }

        if ($lead->status->value === 'converted') {
            throw new RuntimeException('Lead is already converted.');
        }

        if ($lead->status->value === 'lost') {
            throw new RuntimeException('Cannot convert a lost lead.');
        }

        if ($reservationId !== null) {
            $reservation = $this->reservationRepository->findById($reservationId);

            if ($reservation === null) {
                throw new RuntimeException('Reservation not found.');
            }

            $lead->converted_to_reservation_id = $reservationId;
        }

        $lead->status = 'converted';

        $this->leadRepository->save($lead);

        return $lead;
    }
}
