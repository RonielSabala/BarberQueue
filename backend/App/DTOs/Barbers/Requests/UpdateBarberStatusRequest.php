<?php

declare(strict_types=1);

namespace App\DTOs\Barbers\Requests;

use App\Domain\ValueObjects\BarberStatus;
use App\DTOs\BaseRequest;

final readonly class UpdateBarberStatusRequest extends BaseRequest
{
    public function __construct(
        public ?BarberStatus $currentStatus,
        public ?bool $isAccepting,
    ) {}
}
