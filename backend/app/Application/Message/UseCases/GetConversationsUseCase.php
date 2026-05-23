<?php

namespace App\Application\Message\UseCases;

use App\Domain\Message\Repositories\ConversationRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class GetConversationsUseCase
{
    public function __construct(
        private readonly ConversationRepositoryInterface $conversationRepository,
    ) {}

    public function execute(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->conversationRepository->paginateByUser($userId, $filters, $perPage);
    }
}
