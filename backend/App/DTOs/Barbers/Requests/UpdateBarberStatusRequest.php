<?php

declare(strict_types=1);

namespace App\DTOs\Barbers\Requests;

use App\Domain\ValueObjects\BarberCurrentStatus;
use App\DTOs\BaseRequest;

readonly class UpdateBarberStatusRequest extends BaseRequest
{
    public function __construct(
        public ?BarberCurrentStatus $currentStatus,
        public ?bool $isAccepting,
    ) {}
}
