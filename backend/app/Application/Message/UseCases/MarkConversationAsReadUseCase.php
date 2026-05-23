<?php

namespace App\Application\Message\UseCases;

use App\Domain\Message\Repositories\ConversationRepositoryInterface;
use App\Domain\Message\Repositories\MessageRepositoryInterface;
use RuntimeException;

class MarkConversationAsReadUseCase
{
    public function __construct(
        private readonly ConversationRepositoryInterface $conversationRepository,
        private readonly MessageRepositoryInterface $messageRepository,
    ) {}

    public function execute(int $conversationId, int $userId): void
    {
        $conversation = $this->conversationRepository->findById($conversationId);

        if ($conversation === null) {
            throw new RuntimeException('Conversation not found.');
        }

        if ($conversation->guest_id !== $userId && $conversation->host_id !== $userId) {
            throw new RuntimeException('User is not a participant in this conversation.');
        }

        $this->messageRepository->markAllAsRead($conversationId, $userId);
    }
}
