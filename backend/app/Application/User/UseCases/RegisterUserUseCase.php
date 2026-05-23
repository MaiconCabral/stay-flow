<?php

namespace App\Application\User\UseCases;

use App\Application\User\DTOs\UserData;
use App\Domain\User\Events\UserRegistered;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\User\User;
use App\Domain\User\ValueObjects\Email;
use App\Domain\User\ValueObjects\Phone;
use App\Domain\User\ValueObjects\UserRole;
use App\Infrastructure\Auth\SanctumAuthService;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class RegisterUserUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly SanctumAuthService $authService,
    ) {}

    public function execute(UserData $data): array
    {
        $email = new Email($data->email);

        if ($this->userRepository->findByEmail($email->value) !== null) {
            throw new RuntimeException('Email already registered.');
        }

        $phone = new Phone($data->phone);
        $role = $data->role
            ? UserRole::from($data->role)
            : UserRole::Guest;

        $user = new User();
        $user->name = $data->name;
        $user->email = $email->value;
        $user->password = Hash::make($data->password);
        $user->role = $role;
        $user->phone = $phone->value;
        $user->avatar = $data->avatar;
        $user->is_host = $data->isHost || $role === UserRole::Host;

        $this->userRepository->save($user);

        $token = $this->authService->createToken($user);

        event(new UserRegistered($user, $data->password));

        return ['user' => $user, 'token' => $token];
    }
}
