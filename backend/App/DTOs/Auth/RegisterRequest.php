<?php

declare(strict_types=1);

namespace App\DTOs\Auth;

use App\Domain\ValueObjects\{Email, Password, PasswordHash, Phone, Username};

class RegisterRequest
{
    public function __construct(
        public Username $username,
        public Email $email,
        public Phone $phone,
        public Password $password,
        public ?PasswordHash $passwordHash = null,
    ) {}
}
