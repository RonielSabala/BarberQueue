<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\EnumField;

enum BarberStatus: string
{
    case Active = 'active';
    case Inactive = 'inactive';
    case Resting = 'resting';
}

final readonly class BarberCurrentStatus extends EnumField
{
    protected const string ENUM_CLASS = BarberStatus::class;
}
