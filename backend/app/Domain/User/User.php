<?php

namespace App\Domain\User;

use App\Domain\Message\Conversation;
use App\Domain\Message\Message;
use App\Domain\User\ValueObjects\UserRole;
use App\Domain\Property\Property;
use App\Domain\Reservation\Reservation;
use App\Domain\Review\Review;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected static string $factory = UserFactory::class;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'avatar',
        'is_host',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'is_host' => 'boolean',
        ];
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class, 'host_id');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'guest_id');
    }

    public function reviewsGiven(): HasMany
    {
        return $this->hasMany(Review::class, 'guest_id');
    }

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin;
    }

    public function isHost(): bool
    {
        return $this->is_host || $this->role === UserRole::Host;
    }

    public function conversationsAsGuest(): HasMany
    {
        return $this->hasMany(Conversation::class, 'guest_id');
    }

    public function conversationsAsHost(): HasMany
    {
        return $this->hasMany(Conversation::class, 'host_id');
    }

    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }
}
