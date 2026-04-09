<?php

declare(strict_types=1);

namespace App\Domain\Enums;

enum BarberStatusEnum: string
{
    case Active = 'active';
    case Inactive = 'inactive';
    case Resting = 'resting';
}
