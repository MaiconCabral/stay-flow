<?php

namespace Database\Factories;

use App\Domain\Property\Property;
use App\Domain\Review\Review;
use App\Domain\User\User;
use App\Domain\Reservation\Reservation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition(): array
    {
        return [
            'property_id' => Property::factory(),
            'guest_id' => User::factory(),
            'reservation_id' => Reservation::factory(),
            'rating' => fake()->numberBetween(3, 5),
            'comment' => fake()->paragraph(3),
        ];
    }
}
