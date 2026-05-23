<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Payment\Payment;
use App\Domain\Payment\Repositories\PaymentRepositoryInterface;
use App\Enums\PaymentStatus;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentPaymentRepository implements PaymentRepositoryInterface
{
    public function findById(int $id): ?Payment
    {
        return Payment::with(['reservation.property', 'reservation.guest'])->find($id);
    }

    public function save(Payment $payment): Payment
    {
        $payment->save();
        return $payment;
    }

    public function delete(Payment $payment): void
    {
        $payment->delete();
    }

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Payment::query()->with(['reservation.property', 'reservation.guest']);

        $this->applyFilters($query, $filters);

        $sortField = $filters['sort_field'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        return $query->paginate($perPage);
    }

    public function findByReservation(int $reservationId): ?Payment
    {
        return Payment::where('reservation_id', $reservationId)->first();
    }

    public function findByStatus(PaymentStatus $status): array
    {
        return Payment::where('status', $status->value)->get()->all();
    }

    private function applyFilters($query, array $filters): void
    {
        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['reservation_id'])) {
            $query->where('reservation_id', $filters['reservation_id']);
        }

        if (! empty($filters['payment_method'])) {
            $query->where('payment_method', $filters['payment_method']);
        }

        if (! empty($filters['date_from'])) {
            $query->where('payment_date', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('payment_date', '<=', $filters['date_to']);
        }

        if (! empty($filters['amount_min'])) {
            $query->where('amount', '>=', $filters['amount_min']);
        }

        if (! empty($filters['amount_max'])) {
            $query->where('amount', '<=', $filters['amount_max']);
        }
    }
}
