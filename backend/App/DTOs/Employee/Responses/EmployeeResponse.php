<?php

declare(strict_types=1);

namespace App\DTOs\Employee\Responses;

use App\Domain\Entities\{BaseEntity, Employee};
use App\DTOs\BaseResponse;

readonly class EmployeeResponse extends BaseResponse
{
    /** @param EmployeeAssignmentResponse[] $assignments */
    public function __construct(
        public int $id,
        public string $username,
        public string $email,
        public string $phone,
        public string $role,
        public array $assignments,
    ) {}

    public static function fromEntity(BaseEntity $entity): static
    {
        /** @var Employee $entity */
        return new self(
            id: $entity->id->value,
            username: $entity->username->value,
            email: $entity->email->value,
            phone: $entity->phone->value,
            role: $entity->role->value,
            assignments: array_map(
                static fn ($assignment) => new EmployeeAssignmentResponse(
                    barbershopId: $assignment->barbershopId->value,
                    startTime: $assignment->startTime->value,
                    endTime: $assignment->endTime->value,
                    workingDays: $assignment->workingDays,
                ),
                $entity->assignments,
            ),
        );
    }
}
