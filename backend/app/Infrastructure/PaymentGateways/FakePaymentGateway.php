<?php

namespace App\Infrastructure\PaymentGateways;

use App\Domain\Payment\Contracts\PaymentGatewayInterface;
use App\Domain\Payment\ValueObjects\PaymentGatewayResponse;
use Illuminate\Support\Str;

class FakePaymentGateway implements PaymentGatewayInterface
{
    public function charge(float $amount, array $data): PaymentGatewayResponse
    {
        return new PaymentGatewayResponse(
            transactionId: 'fake_' . Str::uuid(),
            status: 'completed',
            rawResponse: [
                'simulated' => true,
                'amount' => $amount,
                'payment_method' => $data['payment_method'] ?? 'unknown',
                'reservation_id' => $data['reservation_id'] ?? null,
                'processed_at' => now()->toISOString(),
            ],
        );
    }

    public function refund(string $transactionId, ?float $amount = null): PaymentGatewayResponse
    {
        return new PaymentGatewayResponse(
            transactionId: $transactionId,
            status: 'refunded',
            rawResponse: [
                'simulated' => true,
                'transaction_id' => $transactionId,
                'refunded_amount' => $amount,
                'refunded_at' => now()->toISOString(),
            ],
        );
    }

    public function getTransactionStatus(string $transactionId): string
    {
        if (str_starts_with($transactionId, 'fake_')) {
            return 'completed';
        }

        return 'failed';
    }
}
