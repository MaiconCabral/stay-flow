<?php

namespace App\Application\User\UseCases;

use App\Application\User\DTOs\UserData;
use App\Domain\User\Events\UserUpdated;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\User\User;
use App\Domain\User\ValueObjects\Email;
use App\Domain\User\ValueObjects\Phone;
use App\Domain\User\ValueObjects\UserRole;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class UpdateUserProfileUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function execute(int $userId, UserData $data): User
    {
        $user = $this->userRepository->findById($userId);

        if ($user === null) {
            throw new RuntimeException('User not found.');
        }

        $changed = [];

        if ($data->name !== null && $data->name !== $user->name) {
            $user->name = $data->name;
            $changed[] = 'name';
        }

        if ($data->email !== null) {
            $email = new Email($data->email);
            if ($email->value !== $user->email) {
                $existing = $this->userRepository->findByEmail($email->value);
                if ($existing !== null && $existing->id !== $user->id) {
                    throw new RuntimeException('Email already in use.');
                }
                $user->email = $email->value;
                $changed[] = 'email';
            }
        }

        if (! empty($data->password)) {
            $user->password = Hash::make($data->password);
            $changed[] = 'password';
        }

        if ($data->role !== null) {
            $role = UserRole::from($data->role);
            if ($role !== $user->role) {
                $user->role = $role;
                $changed[] = 'role';
            }
        }

        if ($data->phone !== null) {
            $phone = new Phone($data->phone);
            if ($phone->value !== $user->phone) {
                $user->phone = $phone->value;
                $changed[] = 'phone';
            }
        }

        if ($data->avatar !== $user->avatar) {
            $user->avatar = $data->avatar;
            $changed[] = 'avatar';
        }

        if ($data->isHost !== null) {
            $user->is_host = $data->isHost || $user->role === UserRole::Host;
        }

        $this->userRepository->save($user);

        if (! empty($changed)) {
            event(new UserUpdated($user, $changed));
        }

        return $user;
    }
}
