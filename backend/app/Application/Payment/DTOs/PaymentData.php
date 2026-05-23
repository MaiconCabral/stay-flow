<?php

namespace App\Application\Payment\DTOs;

readonly class PaymentData
{
    public function __construct(
        public ?int $reservationId = null,
        public ?float $amount = null,
        public ?string $paymentMethod = null,
        public ?string $status = null,
        public ?string $paymentDate = null,
        public ?string $transactionId = null,
        public ?array $gatewayResponse = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            reservationId: isset($data['reservation_id']) ? (int) $data['reservation_id'] : null,
            amount: isset($data['amount']) ? (float) $data['amount'] : null,
            paymentMethod: $data['payment_method'] ?? null,
            status: $data['status'] ?? null,
            paymentDate: $data['payment_date'] ?? null,
            transactionId: $data['transaction_id'] ?? null,
            gatewayResponse: $data['gateway_response'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'reservation_id' => $this->reservationId,
            'amount' => $this->amount,
            'payment_method' => $this->paymentMethod,
            'status' => $this->status,
            'payment_date' => $this->paymentDate,
            'transaction_id' => $this->transactionId,
            'gateway_response' => $this->gatewayResponse,
        ], fn ($val) => $val !== null);
    }
}
