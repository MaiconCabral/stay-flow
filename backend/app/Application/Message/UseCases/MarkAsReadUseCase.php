<?php

namespace App\Application\Message\UseCases;

use App\Domain\Message\Message;
use App\Domain\Message\Repositories\MessageRepositoryInterface;
use RuntimeException;

class MarkAsReadUseCase
{
    public function __construct(
        private readonly MessageRepositoryInterface $messageRepository,
    ) {}

    public function execute(int $messageId, int $userId): Message
    {
        $message = $this->messageRepository->findById($messageId);

        if ($message === null) {
            throw new RuntimeException('Message not found.');
        }

        if ($message->sender_id === $userId) {
            throw new RuntimeException('Cannot mark own message as read.');
        }

        $conversation = $message->conversation;

        if ($conversation->guest_id !== $userId && $conversation->host_id !== $userId) {
            throw new RuntimeException('User is not a participant in this conversation.');
        }

        $updated = $this->messageRepository->markAsRead($messageId);

        if ($updated === null) {
            throw new RuntimeException('Failed to mark message as read.');
        }

        return $updated->load(['sender']);
    }
}
