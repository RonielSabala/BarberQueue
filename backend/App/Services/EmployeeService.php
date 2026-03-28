<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Domain\Entities\Employee;
use App\Domain\ValueObjects\Role;
use App\DTOs\Employee\Requests\UpdateEmployeeAssignmentRequest;
use App\DTOs\Employee\Responses\EmployeeResponse;
use App\Exceptions\EmployeeException;
use App\Repositories\{AssignmentsRepository, EmployeeRepository, RoleRepository};

class EmployeeService
{
    public function __construct(
        private readonly RoleRepository $roleRepository,
        private readonly BarbershopService $barbershopService,
        private readonly AssignmentsRepository $assignmentsRepository,
        private readonly EmployeeRepository $employeeRepository
    ) {}

    private function validateEmployee(int $employeeId): Employee
    {
        $employee = $this->employeeRepository->findById($employeeId);
        if ($employee === null) {
            throw new EmployeeException('Employee not found', HttpStatus::NotFound);
        }

        $role = $this->roleRepository->findByValue($employee->role->value);
        $employeeRole = $role->roleName->value;

        if (
            $employeeRole === Role::Client->value
            || $employeeRole === Role::Admin->value
        ) {
            throw new EmployeeException(
                'The employee role must be \'barber\' or \'assistant\'',
                HttpStatus::UnprocessableEntity
            );
        }

        return $employee;
    }

    public function get(int $employeeId): EmployeeResponse
    {
        $employee = $this->validateEmployee($employeeId);
        return EmployeeResponse::fromEntity($employee);
    }

    public function updateEmployee(
        int $employeeId,
        int $barbershopId,
        UpdateEmployeeAssignmentRequest $request
    ): void {
        $this->validateEmployee($employeeId);
        $this->barbershopService->validateBarbershopExists($barbershopId);

        if (!$this->assignmentsRepository->exists($employeeId, $barbershopId)) {
            throw new EmployeeException('Assignment not found', HttpStatus::NotFound);
        }

        $fields = array_filter([
            'start_time' => $request->startTime?->value,
            'end_time' => $request->endTime?->value,
        ], static fn (mixed $value) => $value !== null);

        $days = $request->workingDays !== null
            ? array_map(static fn ($day) => $day->value, $request->workingDays)
            : null;

        if (empty($fields) && $days === null) {
            throw new EmployeeException(
                'At least one field must be provided for update',
                HttpStatus::BadRequest
            );
        }

        $this->employeeRepository->updateAssignment(
            $employeeId,
            $barbershopId,
            $fields,
            $days
        );
    }

    public function deleteEmployee(int $employeeId): bool
    {
        $this->validateEmployee($employeeId);
        return $this->employeeRepository->delete($employeeId);
    }
}
