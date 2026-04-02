<?php

declare(strict_types=1);

namespace App\DTOs\Employees\Responses;

use App\Attributes\ArrayOf;
use App\DTOs\BaseResponse;

final readonly class EmployeeResponse extends BaseResponse
{
    public function __construct(
        public int $id,
        public string $username,
        public string $email,
        public string $phone,
        public string $role,
        #[ArrayOf(EmployeeAssignmentResponse::class)]
        public array $assignments,
    ) {}
}
