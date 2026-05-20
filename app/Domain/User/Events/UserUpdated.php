<?php

namespace App\Domain\User\Events;

use App\Domain\User\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserUpdated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly User $user,
        public readonly array $changedAttributes,
    ) {}
}
