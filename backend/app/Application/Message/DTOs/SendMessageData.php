<?php

namespace App\Application\Message\DTOs;

readonly class SendMessageData
{
    public function __construct(
        public int $conversationId,
        public int $senderId,
        public string $content,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            conversationId: (int) $data['conversation_id'],
            senderId: (int) $data['sender_id'],
            content: $data['content'],
        );
    }

    public function toArray(): array
    {
        return [
            'conversation_id' => $this->conversationId,
            'sender_id' => $this->senderId,
            'content' => $this->content,
        ];
    }
}
