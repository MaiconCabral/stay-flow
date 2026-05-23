<?php

namespace App\Domain\Wishlist\Repositories;

use App\Domain\Wishlist\Wishlist;
use Illuminate\Pagination\LengthAwarePaginator;

interface WishlistRepositoryInterface
{
    public function findById(int $id): ?Wishlist;

    public function findByUserAndProperty(int $userId, int $propertyId): ?Wishlist;

    public function save(Wishlist $wishlist): Wishlist;

    public function delete(Wishlist $wishlist): void;

    public function paginateByUser(int $userId, int $perPage = 15): LengthAwarePaginator;

    public function exists(int $userId, int $propertyId): bool;

    public function countByUser(int $userId): int;
}
