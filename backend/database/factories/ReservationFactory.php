<?php

namespace Database\Factories;

use App\Domain\Property\Property;
use App\Domain\Reservation\Reservation;
use App\Domain\User\User;
use App\Enums\BookingStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reservation>
 */
class ReservationFactory extends Factory
{
    protected $model = Reservation::class;

    public function definition(): array
    {
        $checkIn = fake()->dateTimeBetween('+1 day', '+3 months');
        $checkOut = (clone $checkIn)->modify('+' . fake()->numberBetween(1, 14) . ' days');
        $nights = (int) $checkIn->diff($checkOut)->days;

        return [
            'property_id' => Property::factory(),
            'guest_id' => User::factory(),
            'check_in' => $checkIn->format('Y-m-d'),
            'check_out' => $checkOut->format('Y-m-d'),
            'total_guests' => fake()->numberBetween(1, 6),
            'subtotal' => fake()->randomFloat(2, 200, 5000),
            'service_fee' => fake()->randomFloat(2, 20, 500),
            'cleaning_fee' => fake()->randomFloat(2, 30, 300),
            'total_price' => fn (array $attrs) => $attrs['subtotal'] + $attrs['service_fee'] + $attrs['cleaning_fee'],
            'status' => fake()->randomElement(['pending', 'confirmed', 'completed']),
            'notes' => fake()->optional(0.3)->sentence(),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => ['status' => BookingStatus::Pending]);
    }

    public function confirmed(): static
    {
        return $this->state(fn () => ['status' => BookingStatus::Confirmed]);
    }

    public function completed(): static
    {
        return $this->state(fn () => ['status' => BookingStatus::Completed]);
    }

    public function cancelled(): static
    {
        return $this->state(fn () => [
            'status' => BookingStatus::Cancelled,
            'cancelled_at' => now(),
            'cancelled_reason' => fake()->sentence(),
        ]);
    }
}
