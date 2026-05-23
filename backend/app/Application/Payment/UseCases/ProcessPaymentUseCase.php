<?php

namespace App\Application\Payment\UseCases;

use App\Domain\Payment\Contracts\PaymentGatewayInterface;
use App\Domain\Payment\Events\PaymentUpdated;
use App\Domain\Payment\Payment;
use App\Domain\Payment\Repositories\PaymentRepositoryInterface;
use RuntimeException;

class ProcessPaymentUseCase
{
    public function __construct(
        private readonly PaymentRepositoryInterface $paymentRepository,
        private readonly PaymentGatewayInterface $paymentGateway,
    ) {}

    public function execute(int $paymentId): Payment
    {
        $payment = $this->paymentRepository->findById($paymentId);

        if ($payment === null) {
            throw new RuntimeException('Payment not found.');
        }

        if ($payment->status->value !== 'pending') {
            throw new RuntimeException('Only pending payments can be processed.');
        }

        $gatewayResponse = $this->paymentGateway->charge(
            amount: (float) $payment->amount,
            data: [
                'reservation_id' => $payment->reservation_id,
                'payment_method' => $payment->payment_method->value,
            ],
        );

        $payment->transaction_id = $gatewayResponse->transactionId;
        $payment->gateway_response = $gatewayResponse->rawResponse;
        $payment->status = $gatewayResponse->status;
        $payment->payment_date = now();

        $this->paymentRepository->save($payment);

        event(new PaymentUpdated($payment, $payment->getChanges()));

        return $payment;
    }
}
