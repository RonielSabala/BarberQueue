<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\Enums\OwnerTypeEnum;
use App\Domain\ValueObjects\Base\EnumField;

final readonly class OwnerType extends EnumField
{
    protected const string ENUM_CLASS = OwnerTypeEnum::class;
}
