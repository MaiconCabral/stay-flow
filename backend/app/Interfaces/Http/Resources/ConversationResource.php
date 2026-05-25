<?php

namespace App\Interfaces\Http\Resources;

use App\Domain\Message\Conversation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Conversation */
class ConversationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'property_id' => $this->property_id,
            'guest_id' => $this->guest_id,
            'host_id' => $this->host_id,
            'reservation_id' => $this->reservation_id,
            'status' => $this->status?->value,
            'status_label' => $this->status?->label(),
            'last_message_at' => $this->last_message_at?->toISOString(),
            'last_message_preview' => $this->last_message_preview,
            'unread_count' => (int) ($this->unread_count ?? 0),
            'property' => $this->whenLoaded('property', fn () => [
                'id' => $this->property->id,
                'title' => $this->property->title,
                'slug' => $this->property->slug,
                'city' => $this->property->city,
                'state' => $this->property->state,
            ]),
            'guest' => $this->whenLoaded('guest', fn () => [
                'id' => $this->guest->id,
                'name' => $this->guest->name,
                'avatar' => $this->guest->avatar,
            ]),
            'host' => $this->whenLoaded('host', fn () => [
                'id' => $this->host->id,
                'name' => $this->host->name,
                'avatar' => $this->host->avatar,
            ]),
            'last_message' => $this->whenLoaded('lastMessage', fn () => [
                'id' => $this->lastMessage->id,
                'content' => $this->lastMessage->content,
                'sender_id' => $this->lastMessage->sender_id,
                'created_at' => $this->lastMessage->created_at?->toISOString(),
            ]),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
