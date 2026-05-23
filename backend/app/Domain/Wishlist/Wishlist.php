<?php

namespace App\Domain\Wishlist;

use App\Domain\Property\Property;
use App\Domain\User\User;
use App\Domain\Wishlist\Events\WishlistItemAdded;
use App\Domain\Wishlist\Events\WishlistItemRemoved;
use Database\Factories\WishlistFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Wishlist extends Model
{
    /** @use HasFactory<WishlistFactory> */
    use HasFactory;

    protected static string $factory = WishlistFactory::class;

    protected $fillable = [
        'user_id',
        'property_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    protected static function booted(): void
    {
        static::created(fn (Wishlist $wishlist) => event(new WishlistItemAdded($wishlist)));
        static::deleted(fn (Wishlist $wishlist) => event(new WishlistItemRemoved($wishlist)));
    }
}
