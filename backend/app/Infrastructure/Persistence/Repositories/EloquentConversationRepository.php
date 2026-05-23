<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Message\Conversation;
use App\Domain\Message\Repositories\ConversationRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentConversationRepository implements ConversationRepositoryInterface
{
    public function findById(int $id): ?Conversation
    {
        return Conversation::with(['property', 'guest', 'host', 'lastMessage'])->find($id);
    }

    public function save(Conversation $conversation): Conversation
    {
        $conversation->save();
        return $conversation;
    }

    public function paginateByUser(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Conversation::with(['property', 'guest', 'host', 'lastMessage'])
            ->where('guest_id', $userId)
            ->orWhere('host_id', $userId);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $sortField = $filters['sort_field'] ?? 'last_message_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        return $query->paginate($perPage);
    }

    public function findExisting(int $propertyId, int $guestId, int $hostId): ?Conversation
    {
        return Conversation::where('property_id', $propertyId)
            ->where('guest_id', $guestId)
            ->where('host_id', $hostId)
            ->where('status', 'active')
            ->first();
    }
}
