<?php

declare(strict_types=1);

namespace App\DTOs\Barbers\Responses;

use App\DTOs\BaseResponse;

final readonly class BarberDashboardResponse extends BaseResponse
{
    public function __construct(
        public int $totalAttendedClients,
        public ?float $averageServiceMinutes,
        public ?float $averageRating,
        public string $joinDate,
    ) {}
}
