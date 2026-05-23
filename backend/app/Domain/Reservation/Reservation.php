<?php

namespace App\Domain\Reservation;

use App\Domain\Property\Property;
use App\Domain\Reservation\Events\ReservationCancelled;
use App\Domain\Reservation\Events\ReservationCompleted;
use App\Domain\Reservation\Events\ReservationCreated;
use App\Domain\Reservation\Events\ReservationUpdated;
use App\Domain\User\User;
use App\Enums\BookingStatus;
use App\Domain\Lead\Lead;
use App\Domain\Payment\Payment;
use App\Domain\Review\Review;
use Database\Factories\ReservationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Reservation extends Model
{
    /** @use HasFactory<ReservationFactory> */
    use HasFactory;

    protected static string $factory = ReservationFactory::class;

    protected $fillable = [
        'property_id',
        'guest_id',
        'check_in',
        'check_out',
        'total_guests',
        'subtotal',
        'service_fee',
        'cleaning_fee',
        'total_price',
        'status',
        'cancelled_at',
        'cancelled_reason',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'check_in' => 'date',
            'check_out' => 'date',
            'subtotal' => 'decimal:2',
            'service_fee' => 'decimal:2',
            'cleaning_fee' => 'decimal:2',
            'total_price' => 'decimal:2',
            'cancelled_at' => 'datetime',
            'status' => BookingStatus::class,
        ];
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guest_id');
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class, 'converted_to_reservation_id');
    }

    protected static function booted(): void
    {
        static::created(fn (Reservation $reservation) => event(new ReservationCreated($reservation)));
        static::updated(fn (Reservation $reservation) => event(new ReservationUpdated($reservation, $reservation->getChanges())));
        static::deleted(fn (Reservation $reservation) => event(new ReservationCompleted($reservation)));
    }
}
