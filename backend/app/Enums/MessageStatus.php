<?php

namespace App\Enums;

enum MessageStatus: string
{
    case Active = 'active';
    case Archived = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Ativa',
            self::Archived => 'Arquivada',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
