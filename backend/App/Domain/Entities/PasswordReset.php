<?php

declare(strict_types=1);

namespace App\Domain\Entities;

use App\Domain\ValueObjects\Id;

readonly class PasswordReset extends BaseEntity
{
    public function __construct(
        public Id $id,
        public Id $userId
    ) {}
}
