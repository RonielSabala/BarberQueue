<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\Enums\ClientStatusEnum;
use App\Domain\ValueObjects\Base\EnumField;

final readonly class ClientStatus extends EnumField
{
    protected const string ENUM_CLASS = ClientStatusEnum::class;
}
