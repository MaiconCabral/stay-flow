<?php

namespace App\Domain\User\ValueObjects;

enum UserRole: string
{
    case Guest = 'guest';
    case Host = 'host';
    case Admin = 'admin';

    public function label(): string
    {
        return match ($this) {
            self::Guest => 'Hóspede',
            self::Host => 'Anfitrião',
            self::Admin => 'Administrador',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
