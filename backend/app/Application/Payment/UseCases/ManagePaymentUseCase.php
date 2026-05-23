<?php

namespace App\Application\Payment\UseCases;

use App\Domain\Payment\Payment;
use App\Domain\Payment\Repositories\PaymentRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use RuntimeException;

class ManagePaymentUseCase
{
    public function __construct(
        private readonly PaymentRepositoryInterface $paymentRepository,
    ) {}

    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->paymentRepository->paginate($filters, $perPage);
    }

    public function find(int $id): Payment
    {
        $payment = $this->paymentRepository->findById($id);

        if ($payment === null) {
            throw new RuntimeException('Payment not found.');
        }

        return $payment;
    }

    public function delete(int $id): void
    {
        $payment = $this->paymentRepository->findById($id);

        if ($payment === null) {
            throw new RuntimeException('Payment not found.');
        }

        $this->paymentRepository->delete($payment);
    }
}
