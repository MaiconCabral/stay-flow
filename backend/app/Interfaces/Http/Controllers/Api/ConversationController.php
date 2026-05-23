<?php

namespace App\Interfaces\Http\Controllers\Api;

use App\Application\Message\DTOs\StartConversationData;
use App\Application\Message\Services\MessageService;
use App\Interfaces\Http\Requests\Message\StartConversationRequest;
use App\Interfaces\Http\Resources\ConversationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController
{
    public function __construct(
        private readonly MessageService $messageService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'sort_field', 'sort_direction']);
        $perPage = $request->input('per_page', 15);

        $conversations = $this->messageService->getConversations(
            $request->user()->id,
            $filters,
            $perPage,
        );

        return response()->json([
            'data' => ConversationResource::collection($conversations->items()),
            'meta' => [
                'current_page' => $conversations->currentPage(),
                'last_page' => $conversations->lastPage(),
                'per_page' => $conversations->perPage(),
                'total' => $conversations->total(),
            ],
        ]);
    }

    public function show(int $id, Request $request): JsonResponse
    {
        $conversation = $this->messageService->findConversation($id, $request->user()->id);

        return response()->json(new ConversationResource($conversation));
    }

    public function store(StartConversationRequest $request): JsonResponse
    {
        $data = StartConversationData::fromArray(array_merge(
            $request->validated(),
            ['guest_id' => $request->user()->id],
        ));

        $conversation = $this->messageService->startConversation($data);

        return response()->json(new ConversationResource($conversation), 201);
    }
}
