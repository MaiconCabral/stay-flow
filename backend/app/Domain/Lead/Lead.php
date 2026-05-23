<?php

namespace App\Domain\Lead;

use App\Domain\Lead\Events\LeadCreated;
use App\Domain\Lead\Events\LeadDeleted;
use App\Domain\Lead\Events\LeadUpdated;
use App\Domain\Property\Property;
use App\Domain\Reservation\Reservation;
use App\Enums\LeadStatus;
use Database\Factories\LeadFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lead extends Model
{
    /** @use HasFactory<LeadFactory> */
    use HasFactory;

    protected static string $factory = LeadFactory::class;

    protected $fillable = [
        'property_id',
        'name',
        'email',
        'phone',
        'message',
        'source',
        'status',
        'converted_to_reservation_id',
    ];

    protected function casts(): array
    {
        return [
            'status' => LeadStatus::class,
        ];
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function convertedToReservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class, 'converted_to_reservation_id');
    }

    protected static function booted(): void
    {
        static::created(fn (Lead $lead) => event(new LeadCreated($lead)));
        static::updated(fn (Lead $lead) => event(new LeadUpdated($lead, $lead->getChanges())));
        static::deleted(fn (Lead $lead) => event(new LeadDeleted($lead)));
    }
}
