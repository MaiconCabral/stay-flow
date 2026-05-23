<?php

namespace App\Domain\Review\Events;

use App\Domain\Review\Review;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReviewUpdated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Review $review,
        public readonly array $changedAttributes,
    ) {}
}
