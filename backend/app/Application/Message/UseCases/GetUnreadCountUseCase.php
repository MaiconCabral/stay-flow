<?php

namespace App\Application\Message\UseCases;

use App\Domain\Message\Repositories\MessageRepositoryInterface;

class GetUnreadCountUseCase
{
    public function __construct(
        private readonly MessageRepositoryInterface $messageRepository,
    ) {}

    public function execute(int $userId): int
    {
        return $this->messageRepository->countUnreadByUser($userId);
    }
}
