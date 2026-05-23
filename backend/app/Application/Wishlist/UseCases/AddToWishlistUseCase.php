<?php

namespace App\Application\Wishlist\UseCases;

use App\Application\Wishlist\DTOs\WishlistData;
use App\Domain\Wishlist\Repositories\WishlistRepositoryInterface;
use App\Domain\Wishlist\Wishlist;
use RuntimeException;

class AddToWishlistUseCase
{
    public function __construct(
        private readonly WishlistRepositoryInterface $wishlistRepository,
    ) {}

    public function execute(WishlistData $data): Wishlist
    {
        if ($this->wishlistRepository->exists($data->userId, $data->propertyId)) {
            throw new RuntimeException('Property is already in your wishlist.');
        }

        $wishlist = new Wishlist();
        $wishlist->user_id = $data->userId;
        $wishlist->property_id = $data->propertyId;

        return $this->wishlistRepository->save($wishlist);
    }
}
