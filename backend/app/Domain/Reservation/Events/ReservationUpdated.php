<?php

namespace App\Domain\Reservation\Events;

use App\Domain\Reservation\Reservation;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReservationUpdated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Reservation $reservation,
        public readonly array $changedAttributes,
    ) {}
}
