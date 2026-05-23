<?php

namespace App\Domain\Payment\Repositories;

use App\Domain\Payment\Payment;
use App\Enums\PaymentStatus;
use Illuminate\Pagination\LengthAwarePaginator;

interface PaymentRepositoryInterface
{
    public function findById(int $id): ?Payment;

    public function save(Payment $payment): Payment;

    public function delete(Payment $payment): void;

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findByReservation(int $reservationId): ?Payment;

    public function findByStatus(PaymentStatus $status): array;
}
