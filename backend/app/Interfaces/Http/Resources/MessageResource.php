<?php

namespace App\Interfaces\Http\Resources;

use App\Domain\Message\Message;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Message */
class MessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'conversation_id' => $this->conversation_id,
            'sender_id' => $this->sender_id,
            'content' => $this->content,
            'read_at' => $this->read_at?->toISOString(),
            'sender' => $this->whenLoaded('sender', fn () => [
                'id' => $this->sender->id,
                'name' => $this->sender->name,
                'avatar' => $this->sender->avatar,
            ]),
            'is_mine' => $request->user()?->id === $this->sender_id,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
