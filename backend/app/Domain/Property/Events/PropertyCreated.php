<?php

namespace App\Domain\Property\Events;

use App\Domain\Property\Property;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PropertyCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Property $property,
    ) {}
}
