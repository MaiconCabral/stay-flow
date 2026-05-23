<?php

namespace App\Interfaces\Http\Controllers\Api;

use App\Application\Lead\DTOs\LeadData;
use App\Application\Lead\Services\LeadService;
use App\Interfaces\Http\Requests\Lead\StoreLeadRequest;
use App\Interfaces\Http\Requests\Lead\UpdateLeadRequest;
use App\Interfaces\Http\Resources\LeadResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadController
{
    public function __construct(
        private readonly LeadService $leadService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'status', 'property_id', 'source',
            'date_from', 'date_to',
            'search',
            'sort_field', 'sort_direction',
        ]);
        $perPage = $request->input('per_page', 15);

        $leads = $this->leadService->list($filters, $perPage);

        return response()->json([
            'data' => LeadResource::collection($leads->items()),
            'meta' => [
                'current_page' => $leads->currentPage(),
                'last_page' => $leads->lastPage(),
                'per_page' => $leads->perPage(),
                'total' => $leads->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $lead = $this->leadService->find($id);

        return response()->json(new LeadResource($lead));
    }

    public function store(StoreLeadRequest $request): JsonResponse
    {
        $data = LeadData::fromArray($request->validated());
        $lead = $this->leadService->create($data);

        return response()->json(new LeadResource($lead), 201);
    }

    public function update(UpdateLeadRequest $request, int $id): JsonResponse
    {
        $data = LeadData::fromArray($request->validated());
        $lead = $this->leadService->update($id, $data);

        return response()->json(new LeadResource($lead));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->leadService->delete($id);

        return response()->json(null, 204);
    }

    public function convert(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'reservation_id' => ['nullable', 'integer', 'exists:reservations,id'],
        ]);

        $lead = $this->leadService->convert($id, $validated['reservation_id'] ?? null);

        return response()->json(new LeadResource($lead));
    }
}
