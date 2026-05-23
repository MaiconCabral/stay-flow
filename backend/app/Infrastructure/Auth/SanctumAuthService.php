<?php

namespace App\Infrastructure\Auth;

use App\Domain\User\User;
use Illuminate\Http\Request;
use RuntimeException;

class SanctumAuthService
{
    public function createToken(User $user, string $name = 'api-token', array $abilities = ['*']): string
    {
        return $user->createToken($name, $abilities)->plainTextToken;
    }

    public function revokeCurrentToken(Request $request): void
    {
        $request->user()?->currentAccessToken()->delete();
    }

    public function revokeAllTokens(User $user): void
    {
        $user->tokens()->delete();
    }

    public function getCurrentUser(Request $request): ?User
    {
        return $request->user();
    }
}
