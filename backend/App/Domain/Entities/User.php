<?php

declare(strict_types=1);

namespace App\Domain\Entities;

use App\Domain\ValueObjects\{Email, Id, PasswordHash, Phone, RoleName, Username};

readonly class User extends BaseEntity
{
    public function __construct(
        public Id $id,
        public Username $username,
        public Email $email,
        public Phone $phone,
        public PasswordHash $passwordHash,
        public RoleName $role
    ) {}
}
