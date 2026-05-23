<?php

namespace App\Domain\Message\Repositories;

use App\Domain\Message\Conversation;
use Illuminate\Pagination\LengthAwarePaginator;

interface ConversationRepositoryInterface
{
    public function findById(int $id): ?Conversation;

    public function save(Conversation $conversation): Conversation;

    public function paginateByUser(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findExisting(int $propertyId, int $guestId, int $hostId): ?Conversation;
}
