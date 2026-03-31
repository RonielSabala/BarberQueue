<?php

declare(strict_types=1);

namespace App\Domain\Entities;

use App\Domain\ValueObjects\{AttendedClients, AverageRating};

readonly class BarbershopDashboardEntity extends BaseEntity
{
    public function __construct(
        public AttendedClients $clientsToday,
        public AttendedClients $clientsThisWeek,
        public AttendedClients $clientsThisMonth,
        public ?float $averageServiceMinutes,
        public ?AverageRating $averageRating,
        public AttendedClients $totalReviews,
        public AttendedClients $activeBarbers,
        public AttendedClients $queueCount,
    ) {}
}
