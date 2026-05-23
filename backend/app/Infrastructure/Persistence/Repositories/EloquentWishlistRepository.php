<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Wishlist\Repositories\WishlistRepositoryInterface;
use App\Domain\Wishlist\Wishlist;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentWishlistRepository implements WishlistRepositoryInterface
{
    public function findById(int $id): ?Wishlist
    {
        return Wishlist::with('property')->find($id);
    }

    public function findByUserAndProperty(int $userId, int $propertyId): ?Wishlist
    {
        return Wishlist::where('user_id', $userId)
            ->where('property_id', $propertyId)
            ->first();
    }

    public function save(Wishlist $wishlist): Wishlist
    {
        $wishlist->save();
        return $wishlist;
    }

    public function delete(Wishlist $wishlist): void
    {
        $wishlist->delete();
    }

    public function paginateByUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return Wishlist::with('property.coverImage')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function exists(int $userId, int $propertyId): bool
    {
        return Wishlist::where('user_id', $userId)
            ->where('property_id', $propertyId)
            ->exists();
    }

    public function countByUser(int $userId): int
    {
        return Wishlist::where('user_id', $userId)->count();
    }
}
