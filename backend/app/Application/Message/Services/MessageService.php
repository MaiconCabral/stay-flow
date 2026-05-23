<?php

namespace App\Application\Message\Services;

use App\Application\Message\DTOs\SendMessageData;
use App\Application\Message\DTOs\StartConversationData;
use App\Application\Message\UseCases\FindConversationUseCase;
use App\Application\Message\UseCases\GetConversationsUseCase;
use App\Application\Message\UseCases\GetMessagesUseCase;
use App\Application\Message\UseCases\GetUnreadCountUseCase;
use App\Application\Message\UseCases\MarkAsReadUseCase;
use App\Application\Message\UseCases\MarkConversationAsReadUseCase;
use App\Application\Message\UseCases\SendMessageUseCase;
use App\Application\Message\UseCases\StartConversationUseCase;
use App\Domain\Message\Conversation;
use App\Domain\Message\Message;
use Illuminate\Pagination\LengthAwarePaginator;

class MessageService
{
    public function __construct(
        private readonly FindConversationUseCase $findConversationUseCase,
        private readonly StartConversationUseCase $startConversationUseCase,
        private readonly SendMessageUseCase $sendMessageUseCase,
        private readonly GetConversationsUseCase $getConversationsUseCase,
        private readonly GetMessagesUseCase $getMessagesUseCase,
        private readonly MarkAsReadUseCase $markAsReadUseCase,
        private readonly MarkConversationAsReadUseCase $markConversationAsReadUseCase,
        private readonly GetUnreadCountUseCase $getUnreadCountUseCase,
    ) {}

    public function findConversation(int $id, int $userId): Conversation
    {
        return $this->findConversationUseCase->execute($id, $userId);
    }

    public function startConversation(StartConversationData $data): Conversation
    {
        return $this->startConversationUseCase->execute($data);
    }

    public function sendMessage(SendMessageData $data): Message
    {
        return $this->sendMessageUseCase->execute($data);
    }

    public function getConversations(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->getConversationsUseCase->execute($userId, $filters, $perPage);
    }

    public function getMessages(int $conversationId, int $userId, int $perPage = 50): LengthAwarePaginator
    {
        return $this->getMessagesUseCase->execute($conversationId, $userId, $perPage);
    }

    public function markAsRead(int $messageId, int $userId): Message
    {
        return $this->markAsReadUseCase->execute($messageId, $userId);
    }

    public function markConversationAsRead(int $conversationId, int $userId): void
    {
        $this->markConversationAsReadUseCase->execute($conversationId, $userId);
    }

    public function getUnreadCount(int $userId): int
    {
        return $this->getUnreadCountUseCase->execute($userId);
    }
}
