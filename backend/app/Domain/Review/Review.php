<?php

namespace App\Domain\Review;

use App\Domain\Property\Property;
use App\Domain\Review\Events\ReviewCreated;
use App\Domain\Review\Events\ReviewDeleted;
use App\Domain\Review\Events\ReviewUpdated;
use App\Domain\User\User;
use App\Domain\Reservation\Reservation;
use Database\Factories\ReviewFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    /** @use HasFactory<ReviewFactory> */
    use HasFactory;

    protected static string $factory = ReviewFactory::class;

    protected $fillable = [
        'property_id',
        'guest_id',
        'reservation_id',
        'rating',
        'comment',
        'host_reply',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
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

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    protected static function booted(): void
    {
        static::created(fn (Review $review) => event(new ReviewCreated($review)));
        static::updated(fn (Review $review) => event(new ReviewUpdated($review, $review->getChanges())));
        static::deleted(fn (Review $review) => event(new ReviewDeleted($review)));
    }
}
