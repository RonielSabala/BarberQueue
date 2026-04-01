<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\Enums\RoleEnum;
use App\Domain\ValueObjects\Base\EnumField;

final readonly class Role extends EnumField
{
    protected const string ENUM_CLASS = RoleEnum::class;
}
