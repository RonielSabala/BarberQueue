<?php

declare(strict_types=1);

namespace App\Domain\Entities\Barbershop;

use App\Domain\Entities\BaseEntity;
use App\Domain\ValueObjects\{AverageRating, NonNegativeInteger};

final readonly class BarbershopDashboardEntity extends BaseEntity
{
    public function __construct(
        public NonNegativeInteger $clientsToday,
        public NonNegativeInteger $clientsThisWeek,
        public NonNegativeInteger $clientsThisMonth,
        public ?float $averageServiceMinutes,
        public ?AverageRating $averageRating,
        public NonNegativeInteger $totalReviews,
        public NonNegativeInteger $activeBarbers,
        public NonNegativeInteger $queueCount,
    ) {}
}
