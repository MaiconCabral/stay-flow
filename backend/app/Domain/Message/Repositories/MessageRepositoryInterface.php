<?php

namespace App\Domain\Message\Repositories;

use App\Domain\Message\Message;
use Illuminate\Pagination\LengthAwarePaginator;

interface MessageRepositoryInterface
{
    public function findById(int $id): ?Message;

    public function save(Message $message): Message;

    public function paginateByConversation(int $conversationId, int $perPage = 50): LengthAwarePaginator;

    public function markAsRead(int $id): ?Message;

    public function markAllAsRead(int $conversationId, int $userId): void;

    public function countUnreadByUser(int $userId): int;
}
