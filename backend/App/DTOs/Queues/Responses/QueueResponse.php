<?php

declare(strict_types=1);

namespace App\DTOs\Queues\Responses;

use App\DTOs\BaseResponse;

final readonly class QueueResponse extends BaseResponse
{
    /** @param TurnResponse[] $turns */
    public function __construct(
        public int $barberId,
        public string $barberName,
        public string $barberStatus,
        public bool $isAccepting,
        public array $turns,
    ) {}
}
