<?php

namespace App\Interfaces\Http\Controllers\Api;

use App\Application\Availability\DTOs\AvailabilityData;
use App\Application\Availability\Services\AvailabilityService;
use App\Interfaces\Http\Requests\Availability\StoreAvailabilityRequest;
use App\Interfaces\Http\Requests\Availability\UpdateAvailabilityRequest;
use App\Interfaces\Http\Resources\AvailabilityResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AvailabilityController
{
    public function __construct(
        private readonly AvailabilityService $availabilityService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'property_id', 'is_available',
            'date_from', 'date_to',
            'price_min', 'price_max',
            'sort_field', 'sort_direction',
        ]);
        $perPage = $request->input('per_page', 15);

        $availabilities = $this->availabilityService->list($filters, $perPage);

        return response()->json([
            'data' => AvailabilityResource::collection($availabilities->items()),
            'meta' => [
                'current_page' => $availabilities->currentPage(),
                'last_page' => $availabilities->lastPage(),
                'per_page' => $availabilities->perPage(),
                'total' => $availabilities->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $availability = $this->availabilityService->find($id);

        return response()->json(new AvailabilityResource($availability));
    }

    public function store(StoreAvailabilityRequest $request): JsonResponse
    {
        $data = AvailabilityData::fromArray($request->validated());
        $availability = $this->availabilityService->create($data);

        return response()->json(new AvailabilityResource($availability), 201);
    }

    public function update(UpdateAvailabilityRequest $request, int $id): JsonResponse
    {
        $data = AvailabilityData::fromArray($request->validated());
        $availability = $this->availabilityService->update($id, $data);

        return response()->json(new AvailabilityResource($availability));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->availabilityService->delete($id);

        return response()->json(null, 204);
    }

    public function check(Request $request): JsonResponse
    {
        $request->validate([
            'property_id' => ['required', 'integer', 'exists:properties,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
        ]);

        $result = $this->availabilityService->checkAvailability(
            (int) $request->input('property_id'),
            $request->input('start_date'),
            $request->input('end_date'),
        );

        return response()->json(['data' => $result]);
    }
}
