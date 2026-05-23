<?php

namespace App\Interfaces\Http\Controllers\Api;

use App\Application\User\DTOs\UserData;
use App\Application\User\Services\UserService;
use App\Domain\User\User;
use App\Infrastructure\Auth\SanctumAuthService;
use App\Interfaces\Http\Requests\Auth\LoginRequest;
use App\Interfaces\Http\Requests\Auth\RegisterRequest;
use App\Interfaces\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController
{
    public function __construct(
        private readonly UserService       $userService,
        private readonly SanctumAuthService $authService,
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $data = UserData::fromArray($request->validated());
        $result = $this->userService->register($data);

        return response()->json([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $this->authService->createToken($user);

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->revokeCurrentToken($request);

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $this->authService->getCurrentUser($request);

        return response()->json(new UserResource($user));
    }
}
