<?php

namespace App\Interfaces\Http\Controllers\Api;

use App\Application\Reservation\DTOs\ReservationData;
use App\Application\Reservation\Services\ReservationService;
use App\Interfaces\Http\Requests\Reservation\CancelReservationRequest;
use App\Interfaces\Http\Requests\Reservation\StoreReservationRequest;
use App\Interfaces\Http\Requests\Reservation\UpdateReservationRequest;
use App\Interfaces\Http\Resources\ReservationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReservationController
{
    public function __construct(
        private readonly ReservationService $reservationService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'status', 'property_id', 'guest_id',
            'check_in_from', 'check_in_to', 'check_out_from', 'check_out_to',
            'date_from', 'date_to',
            'price_min', 'price_max',
            'sort_field', 'sort_direction',
        ]);
        $perPage = $request->input('per_page', 15);

        $reservations = $this->reservationService->list($filters, $perPage);

        return response()->json([
            'data' => ReservationResource::collection($reservations->items()),
            'meta' => [
                'current_page' => $reservations->currentPage(),
                'last_page' => $reservations->lastPage(),
                'per_page' => $reservations->perPage(),
                'total' => $reservations->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $reservation = $this->reservationService->find($id);

        return response()->json(new ReservationResource($reservation));
    }

    public function store(StoreReservationRequest $request): JsonResponse
    {
        $data = ReservationData::fromArray($request->validated() + [
            'guest_id' => $request->user()->id,
        ]);
        $reservation = $this->reservationService->create($data);

        return response()->json(new ReservationResource($reservation), 201);
    }

    public function update(UpdateReservationRequest $request, int $id): JsonResponse
    {
        $data = ReservationData::fromArray($request->validated());
        $reservation = $this->reservationService->update($id, $data);

        return response()->json(new ReservationResource($reservation));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->reservationService->delete($id);

        return response()->json(null, 204);
    }

    public function cancel(CancelReservationRequest $request, int $id): JsonResponse
    {
        $reservation = $this->reservationService->cancel($id, $request->input('reason'));

        return response()->json(new ReservationResource($reservation));
    }
}
