<?php

declare(strict_types=1);

namespace App\DTOs\Auth\Requests;

use App\Domain\ValueObjects\{Email, Password, Phone, Username};
use App\DTOs\BaseRequest;

readonly class RegisterRequest extends BaseRequest
{
    public function __construct(
        public Username $username,
        public Email $email,
        public Phone $phone,
        public Password $password
    ) {}
}
