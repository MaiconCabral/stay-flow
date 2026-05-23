<?php

namespace App\Domain\User\ValueObjects;

use InvalidArgumentException;

readonly class Phone
{
    public ?string $value;

    public function __construct(?string $value)
    {
        if ($value === null || $value === '') {
            $this->value = null;
            return;
        }

        $cleaned = preg_replace('/\D/', '', $value);

        if (strlen($cleaned) < 10 || strlen($cleaned) > 15) {
            throw new InvalidArgumentException("Invalid phone number: {$value}");
        }

        $this->value = $cleaned;
    }

    public function formatted(): string
    {
        if ($this->value === null) {
            return '';
        }

        if (strlen($this->value) === 11) {
            return '(' . substr($this->value, 0, 2) . ') '
                . substr($this->value, 2, 5) . '-'
                . substr($this->value, 7);
        }

        if (strlen($this->value) === 10) {
            return '(' . substr($this->value, 0, 2) . ') '
                . substr($this->value, 2, 4) . '-'
                . substr($this->value, 6);
        }

        return $this->value;
    }

    public function __toString(): string
    {
        return $this->value ?? '';
    }
}
