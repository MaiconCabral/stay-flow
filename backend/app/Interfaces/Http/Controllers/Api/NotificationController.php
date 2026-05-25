<?php

namespace App\Interfaces\Http\Controllers\Api;

use App\Application\Notification\Services\NotificationService;
use App\Interfaces\Http\Resources\NotificationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController
{
    public function __construct(
        private readonly NotificationService $notificationService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['type', 'unread']);
        $perPage = (int) $request->input('per_page', 15);

        $notifications = $this->notificationService->list(Auth::id(), $filters, $perPage);

        return response()->json([
            'data' => NotificationResource::collection($notifications->items()),
            'meta' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ],
        ]);
    }

    public function unreadCount(): JsonResponse
    {
        $count = $this->notificationService->unreadCount(Auth::id());

        return response()->json(['count' => $count]);
    }

    public function markAsRead(int $id): JsonResponse
    {
        $notification = $this->notificationService->markAsRead($id, Auth::id());

        return response()->json(new NotificationResource($notification));
    }

    public function markAllAsRead(): JsonResponse
    {
        $this->notificationService->markAllAsRead(Auth::id());

        return response()->json(['message' => 'All notifications marked as read.']);
    }
}
