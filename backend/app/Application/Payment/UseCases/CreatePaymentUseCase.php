<?php

namespace App\Application\Payment\UseCases;

use App\Application\Payment\DTOs\PaymentData;
use App\Domain\Payment\Payment;
use App\Domain\Payment\Repositories\PaymentRepositoryInterface;
use App\Domain\Reservation\Repositories\ReservationRepositoryInterface;
use RuntimeException;

class CreatePaymentUseCase
{
    public function __construct(
        private readonly PaymentRepositoryInterface $paymentRepository,
        private readonly ReservationRepositoryInterface $reservationRepository,
    ) {}

    public function execute(PaymentData $data): Payment
    {
        $reservation = $this->reservationRepository->findById($data->reservationId);

        if ($reservation === null) {
            throw new RuntimeException('Reservation not found.');
        }

        $existingPayment = $this->paymentRepository->findByReservation($data->reservationId);

        if ($existingPayment !== null) {
            throw new RuntimeException('This reservation already has a payment.');
        }

        $payment = new Payment();
        $payment->reservation_id = $data->reservationId;
        $payment->amount = $data->amount;
        $payment->payment_method = $data->paymentMethod ?? 'card';
        $payment->status = $data->status ?? 'pending';
        $payment->payment_date = $data->paymentDate ?? now();
        $payment->transaction_id = $data->transactionId;
        $payment->gateway_response = $data->gatewayResponse;

        $this->paymentRepository->save($payment);

        return $payment;
    }
}
