<?php

namespace Database\Factories;

use App\Domain\Message\Conversation;
use App\Domain\Property\Property;
use App\Domain\User\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Conversation>
 */
class ConversationFactory extends Factory
{
    protected $model = Conversation::class;

    public function definition(): array
    {
        return [
            'property_id' => Property::factory(),
            'guest_id' => User::factory(),
            'host_id' => User::factory(),
            'reservation_id' => null,
            'status' => 'active',
            'last_message_at' => null,
            'last_message_preview' => null,
        ];
    }

    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'archived',
        ]);
    }
}
