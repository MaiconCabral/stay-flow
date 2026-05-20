<?php

namespace Database\Factories;

use App\Domain\User\User;
use App\Domain\User\ValueObjects\UserRole;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => fake()->randomElement(UserRole::values()),
            'phone' => fake()->optional(0.7)->phoneNumber(),
            'avatar' => fake()->optional(0.3)->imageUrl(),
            'is_host' => fake()->boolean(30),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function guest(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::Guest,
            'is_host' => false,
        ]);
    }

    public function host(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::Host,
            'is_host' => true,
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::Admin,
            'is_host' => false,
        ]);
    }
}
