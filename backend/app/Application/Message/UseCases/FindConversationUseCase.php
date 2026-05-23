<?php

namespace App\Application\Message\UseCases;

use App\Domain\Message\Conversation;
use App\Domain\Message\Repositories\ConversationRepositoryInterface;
use RuntimeException;

class FindConversationUseCase
{
    public function __construct(
        private readonly ConversationRepositoryInterface $conversationRepository,
    ) {}

    public function execute(int $id, int $userId): Conversation
    {
        $conversation = $this->conversationRepository->findById($id);

        if ($conversation === null) {
            throw new RuntimeException('Conversation not found.');
        }

        if ($conversation->guest_id !== $userId && $conversation->host_id !== $userId) {
            throw new RuntimeException('User is not a participant in this conversation.');
        }

        return $conversation;
    }
}
