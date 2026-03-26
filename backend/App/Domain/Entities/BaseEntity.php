<?php

declare(strict_types=1);

namespace App\Domain\Entities;

use App\Domain\ValueObjects\Id;

readonly class BaseEntity
{
    public Id $id;
}
