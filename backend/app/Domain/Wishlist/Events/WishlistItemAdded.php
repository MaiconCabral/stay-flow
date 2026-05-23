<?php

namespace App\Domain\Wishlist\Events;

use App\Domain\Wishlist\Wishlist;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WishlistItemAdded
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Wishlist $wishlist,
    ) {}
}
