<?php

namespace App\Interfaces\Http\Controllers\Api;

use App\Application\Payment\DTOs\PaymentData;
use App\Application\Payment\Services\PaymentService;
use App\Interfaces\Http\Requests\Payment\StorePaymentRequest;
use App\Interfaces\Http\Requests\Payment\UpdatePaymentRequest;
use App\Interfaces\Http\Resources\PaymentResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController
{
    public function __construct(
        private readonly PaymentService $paymentService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'status', 'reservation_id', 'payment_method',
            'date_from', 'date_to',
            'amount_min', 'amount_max',
            'sort_field', 'sort_direction',
        ]);
        $perPage = $request->input('per_page', 15);

        $payments = $this->paymentService->list($filters, $perPage);

        return response()->json([
            'data' => PaymentResource::collection($payments->items()),
            'meta' => [
                'current_page' => $payments->currentPage(),
                'last_page' => $payments->lastPage(),
                'per_page' => $payments->perPage(),
                'total' => $payments->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $payment = $this->paymentService->find($id);

        return response()->json(new PaymentResource($payment));
    }

    public function store(StorePaymentRequest $request): JsonResponse
    {
        $data = PaymentData::fromArray($request->validated());
        $payment = $this->paymentService->create($data);

        return response()->json(new PaymentResource($payment), 201);
    }

    public function update(UpdatePaymentRequest $request, int $id): JsonResponse
    {
        $data = PaymentData::fromArray($request->validated());
        $payment = $this->paymentService->update($id, $data);

        return response()->json(new PaymentResource($payment));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->paymentService->delete($id);

        return response()->json(null, 204);
    }

    public function process(int $id): JsonResponse
    {
        $payment = $this->paymentService->process($id);

        return response()->json(new PaymentResource($payment));
    }

    public function refund(Request $request, int $id): JsonResponse
    {
        $request->validate(['amount' => ['nullable', 'numeric', 'min:0.01']]);
        $payment = $this->paymentService->refund($id, $request->float('amount'));

        return response()->json(new PaymentResource($payment));
    }
}
