<?php

namespace Database\Seeders;

use App\Domain\Property\Property;
use App\Domain\Reservation\Reservation;
use App\Domain\User\User;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        $properties = Property::all();
        $guests = User::whereDoesntHave('properties')->get();

        if ($guests->isEmpty()) {
            $guests = User::factory()->guest()->count(5)->create();
        }

        // Past completed reservations
        foreach ($properties as $property) {
            foreach ($guests->random(min(2, $guests->count())) as $guest) {
                $checkIn = fake()->dateTimeBetween('-6 months', '-2 weeks');
                $checkOut = (clone $checkIn)->modify('+' . fake()->numberBetween(1, 7) . ' days');
                $nights = (int) $checkIn->diff($checkOut)->days;
                $subtotal = $property->price_per_night * $nights;
                $serviceFee = round($subtotal * 0.10, 2);
                $cleaningFee = $property->cleaning_fee ?? 0;

                Reservation::factory()->create([
                    'property_id' => $property->id,
                    'guest_id' => $guest->id,
                    'check_in' => $checkIn->format('Y-m-d'),
                    'check_out' => $checkOut->format('Y-m-d'),
                    'subtotal' => $subtotal,
                    'service_fee' => $serviceFee,
                    'cleaning_fee' => $cleaningFee,
                    'total_price' => $subtotal + $serviceFee + $cleaningFee,
                    'total_guests' => fake()->numberBetween(1, $property->max_guests),
                    'status' => 'completed',
                ]);
            }
        }

        // Active/upcoming confirmed reservations
        for ($i = 0; $i < 15; $i++) {
            $property = $properties->random();
            $guest = $guests->random();
            $checkIn = fake()->dateTimeBetween('now', '+2 months');
            $checkOut = (clone $checkIn)->modify('+' . fake()->numberBetween(1, 5) . ' days');
            $nights = (int) $checkIn->diff($checkOut)->days;
            $subtotal = $property->price_per_night * $nights;
            $serviceFee = round($subtotal * 0.10, 2);
            $cleaningFee = $property->cleaning_fee ?? 0;

            Reservation::factory()->create([
                'property_id' => $property->id,
                'guest_id' => $guest->id,
                'check_in' => $checkIn->format('Y-m-d'),
                'check_out' => $checkOut->format('Y-m-d'),
                'subtotal' => $subtotal,
                'service_fee' => $serviceFee,
                'cleaning_fee' => $cleaningFee,
                'total_price' => $subtotal + $serviceFee + $cleaningFee,
                'total_guests' => fake()->numberBetween(1, $property->max_guests),
                'status' => fake()->randomElement(['pending', 'confirmed']),
            ]);
        }

        // Cancelled reservations
        for ($i = 0; $i < 5; $i++) {
            $property = $properties->random();
            $guest = $guests->random();
            $checkIn = fake()->dateTimeBetween('-2 months', '+1 month');
            $checkOut = (clone $checkIn)->modify('+' . fake()->numberBetween(1, 4) . ' days');
            $nights = (int) $checkIn->diff($checkOut)->days;
            $subtotal = $property->price_per_night * $nights;
            $serviceFee = round($subtotal * 0.10, 2);
            $cleaningFee = $property->cleaning_fee ?? 0;

            Reservation::factory()->cancelled()->create([
                'property_id' => $property->id,
                'guest_id' => $guest->id,
                'check_in' => $checkIn->format('Y-m-d'),
                'check_out' => $checkOut->format('Y-m-d'),
                'subtotal' => $subtotal,
                'service_fee' => $serviceFee,
                'cleaning_fee' => $cleaningFee,
                'total_price' => $subtotal + $serviceFee + $cleaningFee,
                'total_guests' => fake()->numberBetween(1, $property->max_guests),
            ]);
        }
    }
}
