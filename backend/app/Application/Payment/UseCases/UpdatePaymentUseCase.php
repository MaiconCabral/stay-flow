<?php

namespace App\Application\Payment\UseCases;

use App\Application\Payment\DTOs\PaymentData;
use App\Domain\Payment\Payment;
use App\Domain\Payment\Repositories\PaymentRepositoryInterface;
use RuntimeException;

class UpdatePaymentUseCase
{
    public function __construct(
        private readonly PaymentRepositoryInterface $paymentRepository,
    ) {}

    public function execute(int $id, PaymentData $data): Payment
    {
        $payment = $this->paymentRepository->findById($id);

        if ($payment === null) {
            throw new RuntimeException('Payment not found.');
        }

        if ($data->amount !== null) {
            $payment->amount = $data->amount;
        }

        if ($data->paymentMethod !== null) {
            $payment->payment_method = $data->paymentMethod;
        }

        if ($data->status !== null) {
            $payment->status = $data->status;
        }

        if ($data->paymentDate !== null) {
            $payment->payment_date = $data->paymentDate;
        }

        if ($data->transactionId !== null) {
            $payment->transaction_id = $data->transactionId;
        }

        if ($data->gatewayResponse !== null) {
            $payment->gateway_response = $data->gatewayResponse;
        }

        $this->paymentRepository->save($payment);

        return $payment;
    }
}
