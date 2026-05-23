<?php

namespace App\Application\Lead\UseCases;

use App\Application\Lead\DTOs\LeadData;
use App\Domain\Lead\Lead;
use App\Domain\Lead\Repositories\LeadRepositoryInterface;
use App\Domain\Property\Repositories\PropertyRepositoryInterface;
use RuntimeException;

class CreateLeadUseCase
{
    public function __construct(
        private readonly LeadRepositoryInterface $leadRepository,
        private readonly PropertyRepositoryInterface $propertyRepository,
    ) {}

    public function execute(LeadData $data): Lead
    {
        $property = $this->propertyRepository->findById($data->propertyId);

        if ($property === null) {
            throw new RuntimeException('Property not found.');
        }

        $lead = new Lead();
        $lead->property_id = $data->propertyId;
        $lead->name = $data->name;
        $lead->email = $data->email;
        $lead->phone = $data->phone;
        $lead->message = $data->message;
        $lead->source = $data->source;
        $lead->status = $data->status ?? 'new';

        $this->leadRepository->save($lead);

        return $lead;
    }
}
