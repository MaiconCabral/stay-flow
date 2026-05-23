<?php

namespace App\Application\Message\UseCases;

use App\Domain\Message\Repositories\ConversationRepositoryInterface;
use App\Domain\Message\Repositories\MessageRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use RuntimeException;

class GetMessagesUseCase
{
    public function __construct(
        private readonly ConversationRepositoryInterface $conversationRepository,
        private readonly MessageRepositoryInterface $messageRepository,
    ) {}

    public function execute(int $conversationId, int $userId, int $perPage = 50): LengthAwarePaginator
    {
        $conversation = $this->conversationRepository->findById($conversationId);

        if ($conversation === null) {
            throw new RuntimeException('Conversation not found.');
        }

        if ($conversation->guest_id !== $userId && $conversation->host_id !== $userId) {
            throw new RuntimeException('User is not a participant in this conversation.');
        }

        return $this->messageRepository->paginateByConversation($conversationId, $perPage);
    }
}
