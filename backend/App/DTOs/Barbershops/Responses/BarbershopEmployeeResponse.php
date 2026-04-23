<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Responses;

use App\DTOs\BaseResponse;

final readonly class BarbershopEmployeeResponse extends BaseResponse
{
    /** @param int[] $workingDays */
    public function __construct(
        public int $id,
        public string $username,
        public string $email,
        public string $phone,
        public ?string $photoUrl,
        public string $role,
        public string $startTime,
        public string $endTime,
        public array $workingDays,
    ) {}
}
