<?php

namespace App\Domain\Payment\ValueObjects;

readonly class PaymentGatewayResponse
{
    public function __construct(
        public ?string $transactionId,
        public string $status,
        public array $rawResponse = [],
    ) {}
}
