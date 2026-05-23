<?php

namespace App\Application\User\Services;

use App\Application\User\DTOs\UserData;
use App\Application\User\UseCases\ManageUserUseCase;
use App\Application\User\UseCases\RegisterUserUseCase;
use App\Application\User\UseCases\UpdateUserProfileUseCase;
use App\Domain\User\User;
use Illuminate\Pagination\LengthAwarePaginator;

class UserService
{
    public function __construct(
        private readonly RegisterUserUseCase    $registerUserUseCase,
        private readonly UpdateUserProfileUseCase $updateUserProfileUseCase,
        private readonly ManageUserUseCase      $manageUserUseCase,
    ) {}

    public function register(UserData $data): array
    {
        return $this->registerUserUseCase->execute($data);
    }

    public function update(int $id, UserData $data): User
    {
        return $this->updateUserProfileUseCase->execute($id, $data);
    }

    public function find(int $id): User
    {
        return $this->manageUserUseCase->find($id);
    }

    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->manageUserUseCase->list($filters, $perPage);
    }

    public function delete(int $id): void
    {
        $this->manageUserUseCase->delete($id);
    }
}
