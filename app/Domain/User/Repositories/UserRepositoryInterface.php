<?php

namespace App\Domain\User\Repositories;

use App\Domain\User\User;
use App\Domain\User\ValueObjects\UserRole;
use Illuminate\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface
{
    public function findById(int $id): ?User;

    public function findByEmail(string $email): ?User;

    public function save(User $user): User;

    public function delete(User $user): void;

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function countByRole(UserRole $role): int;
}
