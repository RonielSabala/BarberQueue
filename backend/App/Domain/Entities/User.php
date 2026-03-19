<?php

declare(strict_types=1);

namespace App\Domain\Entities;

use App\Attributes\JsonIgnore;
use App\Domain\ValueObjects\{Email, Id, PasswordHash, Phone, RoleName, Username};

readonly class User
{
    public function __construct(
        public Id $id,
        public Username $username,
        public Email $email,
        #[JsonIgnore]
        public Phone $phone,
        #[JsonIgnore]
        public PasswordHash $passwordHash,
        public RoleName $role
    ) {}
}
