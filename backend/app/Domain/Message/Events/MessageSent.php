<?php

namespace App\Domain\Message\Events;

use App\Domain\Message\Message;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Message $message,
    ) {}
}
