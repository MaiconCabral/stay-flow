<?php

namespace App\Domain\Reservation\ValueObjects;

use Carbon\Carbon;
use InvalidArgumentException;

readonly class DateRange
{
    public Carbon $checkIn;
    public Carbon $checkOut;

    public function __construct(
        string $checkIn,
        string $checkOut,
    ) {
        $this->checkIn = Carbon::parse($checkIn)->startOfDay();
        $this->checkOut = Carbon::parse($checkOut)->startOfDay();

        if ($this->checkOut <= $this->checkIn) {
            throw new InvalidArgumentException('Check-out must be after check-in.');
        }
    }

    public function nights(): int
    {
        return (int) $this->checkIn->diffInDays($this->checkOut);
    }

    public function overlaps(self $other): bool
    {
        return $this->checkIn < $other->checkOut && $other->checkIn < $this->checkOut;
    }

    public function toArray(): array
    {
        return [
            'check_in' => $this->checkIn->toDateString(),
            'check_out' => $this->checkOut->toDateString(),
            'nights' => $this->nights(),
        ];
    }
}
