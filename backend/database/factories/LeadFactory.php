<?php

namespace Database\Factories;

use App\Domain\Lead\Lead;
use App\Domain\Property\Property;
use App\Enums\LeadStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Lead> */
class LeadFactory extends Factory
{
    protected $model = Lead::class;

    public function definition(): array
    {
        return [
            'property_id' => Property::factory(),
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'message' => fake()->optional(0.7)->paragraph(),
            'source' => fake()->randomElement(['website', 'airbnb', 'booking', 'direct', 'referral', 'instagram', 'google']),
            'status' => LeadStatus::New,
        ];
    }

    public function contacted(): static
    {
        return $this->state(fn (array $attrs) => ['status' => LeadStatus::Contacted]);
    }

    public function converted(): static
    {
        return $this->state(fn (array $attrs) => ['status' => LeadStatus::Converted]);
    }

    public function lost(): static
    {
        return $this->state(fn (array $attrs) => ['status' => LeadStatus::Lost]);
    }
}
