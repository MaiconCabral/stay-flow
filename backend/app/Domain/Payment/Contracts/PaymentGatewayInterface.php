<?php

namespace App\Domain\Payment\Contracts;

use App\Domain\Payment\ValueObjects\PaymentGatewayResponse;

interface PaymentGatewayInterface
{
    public function charge(float $amount, array $data): PaymentGatewayResponse;

    public function refund(string $transactionId, ?float $amount = null): PaymentGatewayResponse;

    public function getTransactionStatus(string $transactionId): string;
}
