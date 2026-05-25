<?php

namespace App\Domain\Notification\Repositories;

use App\Domain\Notification\Notification;
use Illuminate\Pagination\LengthAwarePaginator;

interface NotificationRepositoryInterface
{
    public function findById(int $id): ?Notification;

    public function save(Notification $notification): Notification;

    public function delete(Notification $notification): void;

    public function paginateByUser(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function unreadCount(int $userId): int;

    public function markAsRead(int $id): void;

    public function markAllAsRead(int $userId): void;

    public function findRecentByUser(int $userId, int $limit = 5): array;
}
