<?php

declare(strict_types=1);

namespace App\Domain\Enums;

enum ClientStatusEnum: string
{
    case Default = 'default';
    case AtBarbershop = 'at_barbershop';
    case OnQueue = 'on_queue';
    case Waiting = 'waiting';
    case InService = 'in_service';
    case Attended = 'attended';
    case Paid = 'paid';
}
