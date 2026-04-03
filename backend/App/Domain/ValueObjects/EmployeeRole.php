<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\Enums\EmployeeRoleEnum;
use App\Domain\ValueObjects\Base\EnumField;

final readonly class EmployeeRole extends EnumField
{
    protected const string ENUM_CLASS = EmployeeRoleEnum::class;
}
