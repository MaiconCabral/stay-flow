<?php

namespace Database\Factories;

use App\Domain\Payment\Payment;
use App\Domain\Reservation\Reservation;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        return [
            'reservation_id' => Reservation::factory(),
            'amount' => fake()->randomFloat(2, 100, 10000),
            'payment_method' => fake()->randomElement(['card', 'pix', 'transfer']),
            'status' => fake()->randomElement(['pending', 'completed']),
            'payment_date' => fake()->optional(0.7)->dateTimeBetween('-30 days', 'now'),
            'transaction_id' => fake()->optional(0.8)->uuid(),
            'gateway_response' => ['simulated' => true],
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => [
            'status' => PaymentStatus::Pending,
            'transaction_id' => null,
            'payment_date' => null,
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn () => [
            'status' => PaymentStatus::Completed,
            'payment_date' => now(),
            'transaction_id' => 'fake_' . fake()->uuid(),
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn () => [
            'status' => PaymentStatus::Failed,
            'transaction_id' => null,
            'gateway_response' => ['error' => 'Payment declined (simulated)'],
        ]);
    }

    public function refunded(): static
    {
        return $this->state(fn () => [
            'status' => PaymentStatus::Refunded,
            'transaction_id' => 'fake_' . fake()->uuid(),
            'gateway_response' => ['refunded' => true],
        ]);
    }
}
