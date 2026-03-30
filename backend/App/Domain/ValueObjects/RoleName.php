<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\EnumField;

enum Role: string
{
    case Client = 'client';
    case Barber = 'barber';
    case Assistant = 'assistant';
    case Admin = 'admin';
}

final readonly class RoleName extends EnumField
{
    protected const string ENUM_CLASS = Role::class;
}
