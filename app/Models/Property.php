<?php

namespace App\Models;

use App\Domain\User\User;
use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'host_id',
        'title',
        'slug',
        'type',
        'description',
        'address',
        'city',
        'state',
        'country',
        'zip_code',
        'property_type',
        'price_per_night',
        'cleaning_fee',
        'max_guests',
        'bedrooms',
        'bathrooms',
        'latitude',
        'longitude',
        'status',
        'check_in_time',
        'check_out_time',
    ];

    protected function casts(): array
    {
        return [
            'price_per_night' => 'decimal:2',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'property_type' => PropertyType::class,
            'status' => PropertyStatus::class,
        ];
    }

    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('order');
    }

    public function coverImage(): HasOne
    {
        return $this->hasOne(PropertyImage::class)->where('is_cover', true);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class);
    }

    public function availabilityBlocks(): HasMany
    {
        return $this->hasMany(Availability::class);
    }
}