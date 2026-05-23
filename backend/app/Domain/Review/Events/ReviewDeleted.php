<?php

namespace App\Domain\Review\Events;

use App\Domain\Review\Review;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReviewDeleted
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Review $review,
    ) {}
}
