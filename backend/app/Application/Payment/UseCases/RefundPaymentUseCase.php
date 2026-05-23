<?php

namespace App\Application\Payment\UseCases;

use App\Domain\Payment\Contracts\PaymentGatewayInterface;
use App\Domain\Payment\Events\PaymentRefunded;
use App\Domain\Payment\Payment;
use App\Domain\Payment\Repositories\PaymentRepositoryInterface;
use RuntimeException;

class RefundPaymentUseCase
{
    public function __construct(
        private readonly PaymentRepositoryInterface $paymentRepository,
        private readonly PaymentGatewayInterface $paymentGateway,
    ) {}

    public function execute(int $paymentId, ?float $amount = null): Payment
    {
        $payment = $this->paymentRepository->findById($paymentId);

        if ($payment === null) {
            throw new RuntimeException('Payment not found.');
        }

        if ($payment->status->value !== 'completed') {
            throw new RuntimeException('Only completed payments can be refunded.');
        }

        $gatewayResponse = $this->paymentGateway->refund(
            transactionId: $payment->transaction_id,
            amount: $amount,
        );

        $payment->status = 'refunded';
        $payment->gateway_response = $gatewayResponse->rawResponse;

        $this->paymentRepository->save($payment);

        event(new PaymentRefunded($payment));

        return $payment;
    }
}
