<?php

namespace App\Application\Notification\Services;

use App\Domain\Notification\Notification;
use App\Domain\Notification\Repositories\NotificationRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use RuntimeException;

class NotificationService
{
    public function __construct(
        private readonly NotificationRepositoryInterface $notificationRepository,
    ) {}

    public function list(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->notificationRepository->paginateByUser($userId, $filters, $perPage);
    }

    public function unreadCount(int $userId): int
    {
        return $this->notificationRepository->unreadCount($userId);
    }

    public function markAsRead(int $id, int $userId): Notification
    {
        $notification = $this->notificationRepository->findById($id);

        if ($notification === null || $notification->user_id !== $userId) {
            throw new RuntimeException('Notification not found.');
        }

        $this->notificationRepository->markAsRead($id);

        $notification->read_at = now();

        return $notification;
    }

    public function markAllAsRead(int $userId): void
    {
        $this->notificationRepository->markAllAsRead($userId);
    }

    public function recent(int $userId, int $limit = 5): array
    {
        return $this->notificationRepository->findRecentByUser($userId, $limit);
    }
}
