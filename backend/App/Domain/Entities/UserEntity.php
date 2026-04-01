<?php

declare(strict_types=1);

namespace App\Domain\Entities;

use App\Domain\ValueObjects\{Email, Id, PasswordHash, Phone, Role, Username};

readonly class UserEntity extends BaseEntity
{
    public function __construct(
        public Id $id,
        public Username $username,
        public Email $email,
        public Phone $phone,
        public PasswordHash $passwordHash,
        public Role $role
    ) {}
}
