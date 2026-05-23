<?php

namespace Database\Factories;

use App\Domain\Property\Property;
use App\Domain\User\User;
use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Property>
 */
class PropertyFactory extends Factory
{
    protected $model = Property::class;

    public function definition(): array
    {
        $title = fake()->sentence(3);

        return [
            'host_id' => User::factory(),
            'title' => $title,
            'slug' => Str::slug($title) . '-' . fake()->unique()->randomNumber(4),
            'type' => fake()->randomElement(['entire_place', 'private_room', 'shared_room']),
            'description' => fake()->paragraphs(2, true),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'state' => fake()->stateAbbr(),
            'country' => 'Brasil',
            'zip_code' => fake()->postcode(),
            'property_type' => fake()->randomElement(PropertyType::values()),
            'price_per_night' => fake()->randomFloat(2, 100, 2000),
            'cleaning_fee' => fake()->randomFloat(2, 50, 300),
            'max_guests' => fake()->numberBetween(1, 12),
            'bedrooms' => fake()->numberBetween(1, 5),
            'bathrooms' => fake()->numberBetween(1, 4),
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
            'status' => PropertyStatus::Available,
            'check_in_time' => '14:00:00',
            'check_out_time' => '11:00:00',
        ];
    }
}
