<?php

namespace Database\Factories;

use App\Domain\Property\Property;
use App\Models\PropertyImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PropertyImage>
 */
class PropertyImageFactory extends Factory
{
    protected $model = PropertyImage::class;

    public function definition(): array
    {
        return [
            'property_id' => Property::factory(),
            'image_url' => fake()->imageUrl(800, 600),
            'is_cover' => false,
            'order' => 0,
        ];
    }
}
