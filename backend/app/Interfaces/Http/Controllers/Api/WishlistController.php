<?php

namespace App\Interfaces\Http\Controllers\Api;

use App\Application\Wishlist\DTOs\WishlistData;
use App\Application\Wishlist\Services\WishlistService;
use App\Interfaces\Http\Requests\Wishlist\StoreWishlistRequest;
use App\Interfaces\Http\Resources\WishlistResource;
use Illuminate\Http\JsonResponse;

class WishlistController
{
    public function __construct(
        private readonly WishlistService $wishlistService,
    ) {}

    public function index(): JsonResponse
    {
        $userId = request()->user()->id;
        $items = $this->wishlistService->getUserWishlist($userId);

        return response()->json([
            'data' => WishlistResource::collection($items->items()),
            'meta' => [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(),
                'total' => $items->total(),
            ],
        ]);
    }

    public function store(StoreWishlistRequest $request): JsonResponse
    {
        $data = WishlistData::fromArray([
            'user_id' => $request->user()->id,
            'property_id' => $request->validated()['property_id'],
        ]);

        $wishlist = $this->wishlistService->add($data);

        return response()->json(new WishlistResource($wishlist), 201);
    }

    public function destroy(int $propertyId): JsonResponse
    {
        $this->wishlistService->remove(request()->user()->id, $propertyId);

        return response()->json(null, 204);
    }
}
