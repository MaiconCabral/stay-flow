<?php

namespace App\Domain\Lead\Events;

use App\Domain\Lead\Lead;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LeadUpdated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Lead $lead,
        public readonly array $changedAttributes,
    ) {}
}
