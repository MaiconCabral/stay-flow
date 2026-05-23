<?php

namespace App\Application\Wishlist\UseCases;

use App\Domain\Wishlist\Repositories\WishlistRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class GetUserWishlistUseCase
{
    public function __construct(
        private readonly WishlistRepositoryInterface $wishlistRepository,
    ) {}

    public function execute(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->wishlistRepository->paginateByUser($userId, $perPage);
    }
}
