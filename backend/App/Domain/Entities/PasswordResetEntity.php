<?php

declare(strict_types=1);

namespace App\Domain\Entities;

use App\Domain\ValueObjects\Id;

final readonly class PasswordResetEntity extends BaseEntity
{
    public function __construct(
        public Id $id,
        public Id $userId
    ) {}
}
