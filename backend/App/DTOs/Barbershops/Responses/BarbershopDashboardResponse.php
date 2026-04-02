<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Responses;

use App\DTOs\BaseResponse;

readonly class BarbershopDashboardResponse extends BaseResponse
{
    public function __construct(
        public int $clientsToday,
        public int $clientsThisWeek,
        public int $clientsThisMonth,
        public ?float $averageServiceMinutes,
        public ?float $averageRating,
        public int $totalReviews,
        public int $activeBarbers,
        public int $queueCount,
    ) {}
}
