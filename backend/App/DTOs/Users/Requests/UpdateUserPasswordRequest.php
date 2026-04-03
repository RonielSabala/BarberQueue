<?php

declare(strict_types=1);

namespace App\DTOs\Users\Requests;

use App\Domain\ValueObjects\Password;
use App\DTOs\BaseRequest;

final readonly class UpdateUserPasswordRequest extends BaseRequest
{
    public function __construct(
        public readonly Password $currentPassword,
        public readonly Password $newPassword
    ) {}
}
