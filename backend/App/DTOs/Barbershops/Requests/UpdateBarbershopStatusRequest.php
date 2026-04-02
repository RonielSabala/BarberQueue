<?php

declare(strict_types=1);

namespace App\DTOs\Barbershops\Requests;

use App\DTOs\BaseRequest;

final readonly class UpdateBarbershopStatusRequest extends BaseRequest
{
    public function __construct(
        public bool $isActive,
    ) {}
}
