<?php

namespace App\Application\Wishlist\UseCases;

use App\Domain\Wishlist\Repositories\WishlistRepositoryInterface;
use RuntimeException;

class RemoveFromWishlistUseCase
{
    public function __construct(
        private readonly WishlistRepositoryInterface $wishlistRepository,
    ) {}

    public function execute(int $userId, int $propertyId): void
    {
        $wishlist = $this->wishlistRepository->findByUserAndProperty($userId, $propertyId);

        if ($wishlist === null) {
            throw new RuntimeException('Property not found in your wishlist.');
        }

        $this->wishlistRepository->delete($wishlist);
    }
}
