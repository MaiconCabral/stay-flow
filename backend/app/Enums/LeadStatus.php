<?php

namespace App\Enums;

enum LeadStatus: string
{
    case New = 'new';
    case Contacted = 'contacted';
    case Converted = 'converted';
    case Lost = 'lost';

    public function label(): string
    {
        return match ($this) {
            self::New => 'Novo',
            self::Contacted => 'Contactado',
            self::Converted => 'Convertido',
            self::Lost => 'Perdido',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
