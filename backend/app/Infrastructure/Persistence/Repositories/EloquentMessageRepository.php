<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Message\Message;
use App\Domain\Message\Repositories\MessageRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentMessageRepository implements MessageRepositoryInterface
{
    public function findById(int $id): ?Message
    {
        return Message::with(['sender', 'conversation'])->find($id);
    }

    public function save(Message $message): Message
    {
        $message->save();
        return $message;
    }

    public function paginateByConversation(int $conversationId, int $perPage = 50): LengthAwarePaginator
    {
        return Message::with(['sender'])
            ->where('conversation_id', $conversationId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function markAsRead(int $id): ?Message
    {
        $message = Message::find($id);

        if ($message === null) {
            return null;
        }

        $message->read_at = now();
        $message->save();

        return $message;
    }

    public function markAllAsRead(int $conversationId, int $userId): void
    {
        Message::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    public function countUnreadByUser(int $userId): int
    {
        return Message::query()
            ->join('conversations', 'messages.conversation_id', '=', 'conversations.id')
            ->where(function ($q) use ($userId) {
                $q->where('conversations.guest_id', $userId)
                  ->orWhere('conversations.host_id', $userId);
            })
            ->where('messages.sender_id', '!=', $userId)
            ->whereNull('messages.read_at')
            ->count();
    }
}
