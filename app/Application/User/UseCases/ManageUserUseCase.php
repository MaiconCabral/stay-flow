<?php

namespace App\Application\User\UseCases;

use App\Domain\User\Events\UserDeleted;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\User\User;
use Illuminate\Pagination\LengthAwarePaginator;
use RuntimeException;

class ManageUserUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->userRepository->paginate($filters, $perPage);
    }

    public function find(int $id): User
    {
        $user = $this->userRepository->findById($id);

        if ($user === null) {
            throw new RuntimeException('User not found.');
        }

        return $user;
    }

    public function delete(int $id): void
    {
        $user = $this->userRepository->findById($id);

        if ($user === null) {
            throw new RuntimeException('User not found.');
        }

        $this->userRepository->delete($user);

        event(new UserDeleted($user));
    }
}
