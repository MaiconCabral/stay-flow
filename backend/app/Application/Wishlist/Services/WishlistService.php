<?php

namespace App\Application\Wishlist\Services;

use App\Application\Wishlist\DTOs\WishlistData;
use App\Application\Wishlist\UseCases\AddToWishlistUseCase;
use App\Application\Wishlist\UseCases\GetUserWishlistUseCase;
use App\Application\Wishlist\UseCases\RemoveFromWishlistUseCase;
use App\Domain\Wishlist\Wishlist;
use Illuminate\Pagination\LengthAwarePaginator;

class WishlistService
{
    public function __construct(
        private readonly AddToWishlistUseCase $addToWishlistUseCase,
        private readonly RemoveFromWishlistUseCase $removeFromWishlistUseCase,
        private readonly GetUserWishlistUseCase $getUserWishlistUseCase,
    ) {}

    public function add(WishlistData $data): Wishlist
    {
        return $this->addToWishlistUseCase->execute($data);
    }

    public function remove(int $userId, int $propertyId): void
    {
        $this->removeFromWishlistUseCase->execute($userId, $propertyId);
    }

    public function getUserWishlist(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->getUserWishlistUseCase->execute($userId, $perPage);
    }
}
