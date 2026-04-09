<?php

declare(strict_types=1);

namespace App\Domain\Enums;

enum EmployeeRoleEnum: string
{
    case Barber = 'barber';
    case Assistant = 'assistant';
}
