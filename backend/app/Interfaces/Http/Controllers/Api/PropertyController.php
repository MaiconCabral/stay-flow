<?php

namespace App\Interfaces\Http\Controllers\Api;

use App\Application\Property\DTOs\PropertyData;
use App\Application\Property\Services\PropertyService;
use App\Interfaces\Http\Requests\Property\StorePropertyRequest;
use App\Interfaces\Http\Requests\Property\UpdatePropertyRequest;
use App\Interfaces\Http\Resources\PropertyResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PropertyController
{
    public function __construct(
        private readonly PropertyService $propertyService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'search', 'city', 'state', 'property_type', 'status',
            'price_min', 'price_max', 'max_guests', 'bedrooms',
            'sort_field', 'sort_direction', 'check_in', 'check_out',
        ]);
        $perPage = $request->input('per_page', 15);

        $properties = $this->propertyService->list($filters, $perPage);

        return response()->json([
            'data' => PropertyResource::collection($properties->items()),
            'meta' => [
                'current_page' => $properties->currentPage(),
                'last_page' => $properties->lastPage(),
                'per_page' => $properties->perPage(),
                'total' => $properties->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $property = $this->propertyService->find($id);

        return response()->json(new PropertyResource($property));
    }

    public function store(StorePropertyRequest $request): JsonResponse
    {
        $data = PropertyData::fromArray($request->validated() + [
            'host_id' => $request->user()->id,
        ]);
        $property = $this->propertyService->create($data);

        return response()->json(new PropertyResource($property), 201);
    }

    public function update(UpdatePropertyRequest $request, int $id): JsonResponse
    {
        $data = PropertyData::fromArray($request->validated());
        $property = $this->propertyService->update($id, $data);

        return response()->json(new PropertyResource($property));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->propertyService->delete($id);

        return response()->json(null, 204);
    }

    public function locations(Request $request): JsonResponse
    {
        $search = $request->input('q');
        $locations = $this->propertyService->locations($search);

        return response()->json([
            'data' => $locations,
        ]);
    }
}
