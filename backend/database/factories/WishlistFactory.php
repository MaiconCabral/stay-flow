<?php

namespace Database\Factories;

use App\Domain\Property\Property;
use App\Domain\User\User;
use App\Domain\Wishlist\Wishlist;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Wishlist>
 */
class WishlistFactory extends Factory
{
    protected $model = Wishlist::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'property_id' => Property::factory(),
        ];
    }
}
