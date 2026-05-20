<?php

namespace App\Interfaces\Http\Controllers\Api;

use App\Application\User\DTOs\UserData;
use App\Application\User\Services\UserService;
use App\Interfaces\Http\Requests\User\StoreUserRequest;
use App\Interfaces\Http\Requests\User\UpdateUserRequest;
use App\Interfaces\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController
{
    public function __construct(
        private readonly UserService $userService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'role', 'is_host', 'sort_field', 'sort_direction']);
        $perPage = $request->input('per_page', 15);

        $users = $this->userService->list($filters, $perPage);

        return response()->json([
            'data' => UserResource::collection($users->items()),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $user = $this->userService->find($id);

        return response()->json(new UserResource($user));
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $data = UserData::fromArray($request->validated());
        $result = $this->userService->register($data);

        return response()->json(new UserResource($result['user']), 201);
    }

    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $data = UserData::fromArray($request->validated());
        $user = $this->userService->update($id, $data);

        return response()->json(new UserResource($user));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->userService->delete($id);

        return response()->json(null, 204);
    }
}
