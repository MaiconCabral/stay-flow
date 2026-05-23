<?php

namespace Database\Seeders;

use App\Domain\Payment\Payment;
use App\Domain\Reservation\Reservation;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $reservations = Reservation::all();

        if ($reservations->isEmpty()) {
            return;
        }

        // Completed payments for completed reservations
        $completedReservations = $reservations->where('status', 'completed');
        foreach ($completedReservations as $reservation) {
            Payment::factory()->completed()->create([
                'reservation_id' => $reservation->id,
                'amount' => $reservation->total_price,
                'payment_method' => fake()->randomElement(['card', 'pix', 'transfer']),
            ]);
        }

        // Pending payments for confirmed reservations
        $confirmedReservations = $reservations->where('status', 'confirmed');
        foreach ($confirmedReservations->take(3) as $reservation) {
            Payment::factory()->pending()->create([
                'reservation_id' => $reservation->id,
                'amount' => $reservation->total_price,
            ]);
        }

        // Failed payments
        $pendingReservations = $reservations->where('status', 'pending');
        foreach ($pendingReservations->take(2) as $reservation) {
            Payment::factory()->failed()->create([
                'reservation_id' => $reservation->id,
                'amount' => $reservation->total_price,
            ]);
        }

        // Refunded payments for cancelled reservations
        $cancelledReservations = $reservations->where('status', 'cancelled');
        foreach ($cancelledReservations as $reservation) {
            Payment::factory()->refunded()->create([
                'reservation_id' => $reservation->id,
                'amount' => $reservation->total_price,
            ]);
        }
    }
}
