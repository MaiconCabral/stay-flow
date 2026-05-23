<?php

namespace Database\Factories;

use App\Domain\Availability\Availability;
use App\Domain\Property\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Availability>
 */
class AvailabilityFactory extends Factory
{
    protected $model = Availability::class;

    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-1 month', '+3 months');
        $endDate = (clone $startDate)->modify('+' . fake()->numberBetween(1, 14) . ' days');

        return [
            'property_id' => Property::factory(),
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'is_available' => fake()->boolean(70),
            'price' => fake()->optional(0.4)->randomFloat(2, 100, 2000),
        ];
    }

    public function available(): static
    {
        return $this->state(fn () => ['is_available' => true]);
    }

    public function blocked(): static
    {
        return $this->state(fn () => ['is_available' => false]);
    }

    public function withCustomPrice(float $price): static
    {
        return $this->state(fn () => ['price' => $price]);
    }
}
