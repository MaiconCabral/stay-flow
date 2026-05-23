<?php

namespace App\Domain\User\ValueObjects;

use InvalidArgumentException;

readonly class Email
{
    public string $value;

    public function __construct(string $value)
    {
        $value = trim(strtolower($value));

        if (! filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid email address: {$value}");
        }

        $this->value = $value;
    }

    public function equals(Email $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
