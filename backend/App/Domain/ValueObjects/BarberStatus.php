<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\Enums\BarberStatusEnum;
use App\Domain\ValueObjects\Base\EnumField;

final readonly class BarberStatus extends EnumField
{
    protected const string ENUM_CLASS = BarberStatusEnum::class;
}
