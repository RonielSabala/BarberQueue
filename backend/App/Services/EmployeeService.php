<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Domain\Entities\EmployeeEntity;
use App\Domain\Enums\EmployeeRoleEnum;
use App\Domain\ValueObjects\DayOfWeek;
use App\DTOs\Employees\Requests\UpdateEmployeeAssignmentRequest;
use App\DTOs\Employees\Responses\EmployeeResponse;
use App\Exceptions\EmployeeException;
use App\Repositories\{
    AssignmentRepository,
    EmployeeRepository,
    RoleRepository,
    UserRepository,
    WorkingDayRepository
};
use App\Services\Barbershop\{BarbershopEmployeeService, BarbershopService};

final readonly class EmployeeService extends BaseService
{
    public function __construct(
        private readonly RoleRepository $roleRepository,
        private readonly AssignmentRepository $assignmentsRepository,
        private readonly WorkingDayRepository $workingDayRepository,
        private readonly EmployeeRepository $employeeRepository,
        private readonly UserRepository $userRepository,
        private readonly BarbershopService $barbershopService,
        private readonly BarbershopEmployeeService $barbershopEmployeeService,
    ) {}

    private function validateEmployee(int $employeeId): EmployeeEntity
    {
        $user = $this->userRepository->getById($employeeId);
        if ($user === null) {
            throw new EmployeeException('Employee not found', HttpStatus::NotFound);
        }

        $role = $this->roleRepository->getByValue($user->role->value);
        $employeeRole = $role->roleName->value;

        if (
            !\in_array($employeeRole, [
                EmployeeRoleEnum::Barber->value,
                EmployeeRoleEnum::Assistant->value,
            ], true)
        ) {
            throw new EmployeeException(
                'This user is not an employee',
                HttpStatus::UnprocessableEntity
            );
        }

        return new EmployeeEntity(
            id: $user->id,
            username: $user->username,
            email: $user->email,
            phone: $user->phone,
            role: $user->role,
            assignments: $this->assignmentsRepository->getAllByStaffId($employeeId),
        );
    }

    public function get(int $employeeId): EmployeeResponse
    {
        $employee = $this->validateEmployee($employeeId);
        return EmployeeResponse::fromEntity($employee);
    }

    public function updateEmployeeAssignment(
        int $employeeId,
        int $barbershopId,
        UpdateEmployeeAssignmentRequest $request
    ): void {
        $employee = $this->validateEmployee($employeeId);
        $barbershop = $this->barbershopService->validateBarbershopExists($barbershopId);

        $employeeAssignment = null;
        foreach ($employee->assignments as $assignment) {
            if ($barbershopId === $assignment->barbershopId->value) {
                $employeeAssignment = $assignment;
                break;
            }
        }

        if ($employeeAssignment === null) {
            throw new EmployeeException('Assignment not found', HttpStatus::NotFound);
        }

        $fields = $this->validateFieldsToUpdate($request);
        $days = $fields['working_days'] ?? null;
        $startTime = (
            $request->startTime?->value
            ?? $employeeAssignment->startTime->value
        );
        $endTime = (
            $request->endTime?->value
            ?? $employeeAssignment->endTime->value
        );

        $this->barbershopEmployeeService->validateEmployeeWorkingHours(
            startTime: $startTime,
            endTime: $endTime,
            barbershopOpensAt: $barbershop->opensAt->value,
            barbershopClosesAt: $barbershop->closesAt->value,
        );
        $this->barbershopEmployeeService->validateEmployeeWorkingDays(
            employeeId: $employeeId,
            barbershopId: $barbershopId,
            startTime: $startTime,
            endTime: $endTime,
            workingDays: $days ?? array_map(
                static fn (DayOfWeek $day) => $day->value,
                $employeeAssignment->workingDays
            ),
        );

        $this->employeeRepository->transaction(
            function () use (
                $barbershopId,
                $employeeId,
                $days,
                $fields
            ): void {
                $role = $fields['role'] ?? null;
                unset($fields['role'], $fields['working_days']);

                $this->assignmentsRepository->updateAssignment($employeeId, $barbershopId, $fields);
                if ($days) {
                    $this->workingDayRepository->deleteWorkingDays($employeeId, $barbershopId);
                    $this->workingDayRepository->createWorkingDays($employeeId, $barbershopId, $days);
                }

                if ($role) {
                    $roleEntity = $this->roleRepository->getByValue($role);
                    $this->userRepository->updateRole($employeeId, $roleEntity->id->value);
                }
            }
        );
    }

    public function deleteEmployee(int $employeeId): bool
    {
        $this->validateEmployee($employeeId);
        return $this->employeeRepository->delete($employeeId);
    }
}
