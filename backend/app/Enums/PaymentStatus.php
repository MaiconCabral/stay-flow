<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case Pending = 'pending';
    case Completed = 'completed';
    case Failed = 'failed';
    case Refunded = 'refunded';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pendente',
            self::Completed => 'Concluído',
            self::Failed => 'Falhou',
            self::Refunded => 'Reembolsado',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
