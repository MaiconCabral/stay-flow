<?php

namespace App\Application\Lead\UseCases;

use App\Application\Lead\DTOs\LeadData;
use App\Domain\Lead\Lead;
use App\Domain\Lead\Repositories\LeadRepositoryInterface;
use RuntimeException;

class UpdateLeadUseCase
{
    public function __construct(
        private readonly LeadRepositoryInterface $leadRepository,
    ) {}

    public function execute(int $id, LeadData $data): Lead
    {
        $lead = $this->leadRepository->findById($id);

        if ($lead === null) {
            throw new RuntimeException('Lead not found.');
        }

        if ($data->name !== null) {
            $lead->name = $data->name;
        }

        if ($data->email !== null) {
            $lead->email = $data->email;
        }

        if ($data->phone !== null) {
            $lead->phone = $data->phone;
        }

        if ($data->message !== null) {
            $lead->message = $data->message;
        }

        if ($data->source !== null) {
            $lead->source = $data->source;
        }

        if ($data->status !== null) {
            $lead->status = $data->status;
        }

        if ($data->convertedToReservationId !== null) {
            $lead->converted_to_reservation_id = $data->convertedToReservationId;
        }

        $this->leadRepository->save($lead);

        return $lead;
    }
}
