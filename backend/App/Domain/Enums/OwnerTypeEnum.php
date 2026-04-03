<?php

declare(strict_types=1);

namespace App\Domain\Enums;

enum OwnerTypeEnum: string
{
    case Client = 'client';
    case Member = 'member';
}
