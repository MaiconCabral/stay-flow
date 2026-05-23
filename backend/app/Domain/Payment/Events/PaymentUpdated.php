<?php

namespace App\Domain\Payment\Events;

use App\Domain\Payment\Payment;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentUpdated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Payment $payment,
        public readonly array $changedAttributes,
    ) {}
}
