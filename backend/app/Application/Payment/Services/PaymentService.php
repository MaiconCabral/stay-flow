<?php

namespace App\Application\Payment\Services;

use App\Application\Payment\DTOs\PaymentData;
use App\Application\Payment\UseCases\CreatePaymentUseCase;
use App\Application\Payment\UseCases\ManagePaymentUseCase;
use App\Application\Payment\UseCases\ProcessPaymentUseCase;
use App\Application\Payment\UseCases\RefundPaymentUseCase;
use App\Application\Payment\UseCases\UpdatePaymentUseCase;
use App\Domain\Payment\Payment;
use Illuminate\Pagination\LengthAwarePaginator;

class PaymentService
{
    public function __construct(
        private readonly CreatePaymentUseCase $createPaymentUseCase,
        private readonly UpdatePaymentUseCase $updatePaymentUseCase,
        private readonly ManagePaymentUseCase $managePaymentUseCase,
        private readonly ProcessPaymentUseCase $processPaymentUseCase,
        private readonly RefundPaymentUseCase $refundPaymentUseCase,
    ) {}

    public function create(PaymentData $data): Payment
    {
        return $this->createPaymentUseCase->execute($data);
    }

    public function update(int $id, PaymentData $data): Payment
    {
        return $this->updatePaymentUseCase->execute($id, $data);
    }

    public function find(int $id): Payment
    {
        return $this->managePaymentUseCase->find($id);
    }

    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->managePaymentUseCase->list($filters, $perPage);
    }

    public function delete(int $id): void
    {
        $this->managePaymentUseCase->delete($id);
    }

    public function process(int $id): Payment
    {
        return $this->processPaymentUseCase->execute($id);
    }

    public function refund(int $id, ?float $amount = null): Payment
    {
        return $this->refundPaymentUseCase->execute($id, $amount);
    }
}
