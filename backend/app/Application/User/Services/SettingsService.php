<?php

namespace App\Application\User\Services;

use App\Domain\User\Repositories\UserRepositoryInterface;
use RuntimeException;

class SettingsService
{
    private const DEFAULT_NOTIFICATIONS = [
        'new_booking' => true,
        'cancellations' => true,
        'messages' => true,
        'reviews' => true,
        'reminders' => false,
        'weekly_report' => true,
    ];

    private const DEFAULT_PAYOUT = [
        'method' => 'pix',
        'pix_key' => '',
        'bank' => '',
        'agency' => '',
        'account' => '',
        'paypal_email' => '',
        'threshold' => 100,
        'schedule' => 'weekly',
    ];

    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function getSettings(int $userId): array
    {
        $user = $this->userRepository->findById($userId);

        if ($user === null) {
            throw new RuntimeException('User not found.');
        }

        return [
            'notifications' => array_merge(
                self::DEFAULT_NOTIFICATIONS,
                $user->notification_settings ?? [],
            ),
            'payout' => array_merge(
                self::DEFAULT_PAYOUT,
                $user->payout_settings ?? [],
            ),
        ];
    }

    public function updateNotificationSettings(int $userId, array $data): array
    {
        $user = $this->userRepository->findById($userId);

        if ($user === null) {
            throw new RuntimeException('User not found.');
        }

        $current = $user->notification_settings ?? [];
        $user->notification_settings = array_merge($current, $data);
        $this->userRepository->save($user);

        return array_merge(self::DEFAULT_NOTIFICATIONS, $user->notification_settings);
    }

    public function updatePayoutSettings(int $userId, array $data): array
    {
        $user = $this->userRepository->findById($userId);

        if ($user === null) {
            throw new RuntimeException('User not found.');
        }

        $current = $user->payout_settings ?? [];
        $user->payout_settings = array_merge($current, $data);
        $this->userRepository->save($user);

        return array_merge(self::DEFAULT_PAYOUT, $user->payout_settings);
    }
}
