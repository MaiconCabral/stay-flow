<?php

namespace App\Application\Message\UseCases;

use App\Application\Message\DTOs\SendMessageData;
use App\Domain\Message\Message;
use App\Domain\Message\Repositories\ConversationRepositoryInterface;
use App\Domain\Message\Repositories\MessageRepositoryInterface;
use RuntimeException;

class SendMessageUseCase
{
    public function __construct(
        private readonly ConversationRepositoryInterface $conversationRepository,
        private readonly MessageRepositoryInterface $messageRepository,
    ) {}

    public function execute(SendMessageData $data): Message
    {
        $conversation = $this->conversationRepository->findById($data->conversationId);

        if ($conversation === null) {
            throw new RuntimeException('Conversation not found.');
        }

        if ($conversation->guest_id !== $data->senderId && $conversation->host_id !== $data->senderId) {
            throw new RuntimeException('User is not a participant in this conversation.');
        }

        $message = new Message();
        $message->conversation_id = $data->conversationId;
        $message->sender_id = $data->senderId;
        $message->content = $data->content;

        $this->messageRepository->save($message);

        $conversation->last_message_at = $message->created_at;
        $conversation->last_message_preview = mb_substr($data->content, 0, 255);
        $this->conversationRepository->save($conversation);

        return $message->load(['sender']);
    }
}
