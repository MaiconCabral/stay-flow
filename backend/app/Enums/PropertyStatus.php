<?php

namespace App\Enums;

enum PropertyStatus: string
{
    case Available = 'available';
    case Unavailable = 'unavailable';
    case Pending = 'pending';

    public function label(): string
    {
        return match ($this) {
            self::Available => 'Disponível',
            self::Unavailable => 'Indisponível',
            self::Pending => 'Pendente',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
