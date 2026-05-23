<?php

namespace App\Domain\Availability;

use App\Domain\Availability\Events\AvailabilityCreated;
use App\Domain\Availability\Events\AvailabilityDeleted;
use App\Domain\Availability\Events\AvailabilityUpdated;
use App\Domain\Property\Property;
use Database\Factories\AvailabilityFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Availability extends Model
{
    /** @use HasFactory<AvailabilityFactory> */
    use HasFactory;

    protected static string $factory = AvailabilityFactory::class;

    protected $fillable = [
        'property_id',
        'start_date',
        'end_date',
        'is_available',
        'price',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_available' => 'boolean',
            'price' => 'decimal:2',
        ];
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    protected static function booted(): void
    {
        static::created(fn (Availability $availability) => event(new AvailabilityCreated($availability)));
        static::updated(fn (Availability $availability) => event(new AvailabilityUpdated($availability, $availability->getChanges())));
        static::deleted(fn (Availability $availability) => event(new AvailabilityDeleted($availability)));
    }
}
