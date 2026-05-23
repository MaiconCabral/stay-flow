<?php

namespace App\Domain\Message;

use App\Domain\Message\Events\ConversationStarted;
use App\Domain\Property\Property;
use App\Domain\Reservation\Reservation;
use App\Domain\User\User;
use App\Enums\MessageStatus;
use Database\Factories\ConversationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Conversation extends Model
{
    /** @use HasFactory<ConversationFactory> */
    use HasFactory;

    protected static string $factory = ConversationFactory::class;

    protected $fillable = [
        'property_id',
        'guest_id',
        'host_id',
        'reservation_id',
        'status',
        'last_message_at',
        'last_message_preview',
    ];

    protected function casts(): array
    {
        return [
            'status' => MessageStatus::class,
            'last_message_at' => 'datetime',
        ];
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guest_id');
    }

    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function lastMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    protected static function booted(): void
    {
        static::created(fn (Conversation $conversation) => event(new ConversationStarted($conversation)));
    }
}
