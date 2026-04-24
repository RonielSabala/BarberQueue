<?php

declare(strict_types=1);

namespace App\DTOs\Auth\Requests;

use App\DTOs\BaseRequest;
use App\Domain\ValueObjects\{Email, Password, Phone, PhotoUrl, Username};

final readonly class RegisterRequest extends BaseRequest
{
    public function __construct(
        public Username $username,
        public Email $email,
        public Phone $phone,
        public ?PhotoUrl $photoUrl,
        public Password $password
    ) {}
}
