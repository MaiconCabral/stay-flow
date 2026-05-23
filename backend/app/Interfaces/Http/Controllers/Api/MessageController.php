<?php

namespace App\Interfaces\Http\Controllers\Api;

use App\Application\Message\DTOs\SendMessageData;
use App\Application\Message\Services\MessageService;
use App\Interfaces\Http\Requests\Message\SendMessageRequest;
use App\Interfaces\Http\Resources\MessageResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController
{
    public function __construct(
        private readonly MessageService $messageService,
    ) {}

    public function index(int $conversationId, Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 50);

        $messages = $this->messageService->getMessages(
            $conversationId,
            $request->user()->id,
            $perPage,
        );

        return response()->json([
            'data' => MessageResource::collection($messages->items()),
            'meta' => [
                'current_page' => $messages->currentPage(),
                'last_page' => $messages->lastPage(),
                'per_page' => $messages->perPage(),
                'total' => $messages->total(),
            ],
        ]);
    }

    public function store(SendMessageRequest $request, int $conversationId): JsonResponse
    {
        $data = SendMessageData::fromArray([
            'conversation_id' => $conversationId,
            'sender_id' => $request->user()->id,
            'content' => $request->validated()['content'],
        ]);

        $message = $this->messageService->sendMessage($data);

        return response()->json(new MessageResource($message), 201);
    }

    public function markAsRead(int $id, Request $request): JsonResponse
    {
        $message = $this->messageService->markAsRead($id, $request->user()->id);

        return response()->json(new MessageResource($message));
    }

    public function markConversationAsRead(int $conversationId, Request $request): JsonResponse
    {
        $this->messageService->markConversationAsRead($conversationId, $request->user()->id);

        return response()->json(['message' => 'All messages marked as read.']);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = $this->messageService->getUnreadCount($request->user()->id);

        return response()->json(['unread_count' => $count]);
    }
}
