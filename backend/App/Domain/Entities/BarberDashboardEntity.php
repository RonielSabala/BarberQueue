<?php

declare(strict_types=1);

namespace App\Domain\Entities;

use App\Domain\ValueObjects\{AttendedClients, AverageRating, DateTimeString, TimeOfDay};

readonly class BarberDashboardEntity extends BaseEntity
{
    public function __construct(
        public AttendedClients $totalAttendedClients,
        public ?TimeOfDay $averageTimeWithClients,
        public ?AverageRating $averageRating,
        public DateTimeString $joinDate,
    ) {}
}
