<?php

namespace App\Interfaces\Http\Controllers\Api;

use App\Application\Review\DTOs\ReviewData;
use App\Application\Review\Services\ReviewService;
use App\Domain\Property\Repositories\PropertyRepositoryInterface;
use App\Interfaces\Http\Requests\Review\StoreReviewRequest;
use App\Interfaces\Http\Requests\Review\UpdateReviewRequest;
use App\Interfaces\Http\Resources\ReviewResource;
use Illuminate\Http\JsonResponse;

class ReviewController
{
    public function __construct(
        private readonly ReviewService $reviewService,
        private readonly PropertyRepositoryInterface $propertyRepository,
    ) {}

    public function index(int $propertyId): JsonResponse
    {
        $this->propertyRepository->findById($propertyId);

        $reviews = $this->reviewService->findByProperty($propertyId);

        return response()->json([
            'data' => ReviewResource::collection($reviews->items()),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
                'average_rating' => $this->reviewService->averageRating($propertyId),
            ],
        ]);
    }

    public function store(StoreReviewRequest $request, int $propertyId): JsonResponse
    {
        $this->propertyRepository->findById($propertyId);

        $data = ReviewData::fromArray($request->validated() + [
            'property_id' => $propertyId,
            'guest_id' => $request->user()->id,
        ]);

        $review = $this->reviewService->create($data);

        return response()->json(new ReviewResource($review), 201);
    }

    public function show(int $id): JsonResponse
    {
        $review = $this->reviewService->find($id);

        return response()->json(new ReviewResource($review));
    }

    public function update(UpdateReviewRequest $request, int $id): JsonResponse
    {
        $data = ReviewData::fromArray($request->validated());
        $review = $this->reviewService->update($id, $data, $request->user()->id);

        return response()->json(new ReviewResource($review));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->reviewService->delete($id, request()->user()->id);

        return response()->json(null, 204);
    }
}
