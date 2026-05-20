<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Card = 'card';
    case Pix = 'pix';
    case Transfer = 'transfer';

    public function label(): string
    {
        return match ($this) {
            self::Card => 'Cartão',
            self::Pix => 'Pix',
            self::Transfer => 'Transferência',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
