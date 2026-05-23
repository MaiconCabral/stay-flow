<?php

namespace App\Enums;

enum PropertyType: string
{
    case House = 'house';
    case Apartment = 'apartment';
    case Villa = 'villa';
    case Cabin = 'cabin';
    case Cottage = 'cottage';
    case Loft = 'loft';
    case Studio = 'studio';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::House => 'Casa',
            self::Apartment => 'Apartamento',
            self::Villa => 'Vila',
            self::Cabin => 'Cabana',
            self::Cottage => 'Chalé',
            self::Loft => 'Loft',
            self::Studio => 'Studio',
            self::Other => 'Outro',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
