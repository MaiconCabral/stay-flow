<?php

namespace App\Domain\Availability\Events;

use App\Domain\Availability\Availability;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AvailabilityDeleted
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Availability $availability,
    ) {}
}
