<?php

declare(strict_types=1);

namespace App\Domain\Entities\Barber;

use App\Domain\Entities\BaseEntity;
use App\Domain\ValueObjects\{AverageRating, DateTimeString, NonNegativeInteger};

final readonly class BarberDashboardEntity extends BaseEntity
{
    public function __construct(
        public NonNegativeInteger $totalAttendedClients,
        public ?float $averageServiceMinutes,
        public ?AverageRating $averageRating,
        public DateTimeString $joinDate,
    ) {}
}
