<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Notification\Notification;
use App\Domain\Notification\Repositories\NotificationRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentNotificationRepository implements NotificationRepositoryInterface
{
    public function findById(int $id): ?Notification
    {
        return Notification::find($id);
    }

    public function save(Notification $notification): Notification
    {
        $notification->save();

        return $notification;
    }

    public function delete(Notification $notification): void
    {
        $notification->delete();
    }

    public function paginateByUser(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Notification::where('user_id', $userId);

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['unread'])) {
            $query->unread();
        }

        $query->orderBy('created_at', 'desc');

        return $query->paginate($perPage);
    }

    public function unreadCount(int $userId): int
    {
        return Notification::where('user_id', $userId)->unread()->count();
    }

    public function markAsRead(int $id): void
    {
        Notification::where('id', $id)->update(['read_at' => now()]);
    }

    public function markAllAsRead(int $userId): void
    {
        Notification::where('user_id', $userId)->unread()->update(['read_at' => now()]);
    }

    public function findRecentByUser(int $userId, int $limit = 5): array
    {
        return Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->all();
    }
}
