<?php

declare(strict_types=1);

namespace App\Domain\Enums;

enum RoleEnum: string
{
    case Client = 'client';
    case Barber = 'barber';
    case Assistant = 'assistant';
    case Admin = 'admin';
}
