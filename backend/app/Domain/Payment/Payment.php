<?php

namespace App\Domain\Payment;

use App\Domain\Payment\Events\PaymentCreated;
use App\Domain\Payment\Events\PaymentRefunded;
use App\Domain\Payment\Events\PaymentUpdated;
use App\Domain\Reservation\Reservation;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Database\Factories\PaymentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    /** @use HasFactory<PaymentFactory> */
    use HasFactory;

    protected static string $factory = PaymentFactory::class;

    protected $fillable = [
        'reservation_id',
        'amount',
        'payment_method',
        'status',
        'payment_date',
        'transaction_id',
        'gateway_response',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'payment_date' => 'datetime',
            'gateway_response' => 'array',
            'payment_method' => PaymentMethod::class,
            'status' => PaymentStatus::class,
        ];
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    protected static function booted(): void
    {
        static::created(fn (Payment $payment) => event(new PaymentCreated($payment)));
        static::updated(fn (Payment $payment) => event(new PaymentUpdated($payment, $payment->getChanges())));
    }
}
