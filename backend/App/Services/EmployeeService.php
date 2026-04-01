<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Domain\Entities\EmployeeEntity;
use App\Domain\ValueObjects\Role;
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

class EmployeeService extends BaseService
{
    public function __construct(
        private readonly RoleRepository $roleRepository,
        private readonly AssignmentRepository $assignmentsRepository,
        private readonly WorkingDayRepository $workingDayRepository,
        private readonly EmployeeRepository $employeeRepository,
        private readonly UserRepository $userRepository,
        private readonly BarbershopService $barbershopService,
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
            $employeeRole === Role::Client->value
            || $employeeRole === Role::Admin->value
        ) {
            throw new EmployeeException(
                'The employee role must be \'barber\' or \'assistant\'',
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
        $this->validateEmployee($employeeId);
        $this->barbershopService->validateBarbershopExists($barbershopId);

        if (!$this->assignmentsRepository->assignmentExists($employeeId, $barbershopId)) {
            throw new EmployeeException('Assignment not found', HttpStatus::NotFound);
        }

        $fields = $this->validateFieldsToUpdate($request);

        $this->employeeRepository->transaction(
            function () use ($employeeId, $barbershopId, $fields): void {
                $days = $fields['working_days'] ?? null;
                unset($fields['working_days']);

                $this->assignmentsRepository->updateAssignment($employeeId, $barbershopId, $fields);

                if (!$days) {
                    return;
                }

                $this->workingDayRepository->deleteWorkingDays($employeeId, $barbershopId);
                $this->workingDayRepository->createWorkingDays($employeeId, $barbershopId, $days);
            }
        );
    }

    public function deleteEmployee(int $employeeId): bool
    {
        $this->validateEmployee($employeeId);
        return $this->employeeRepository->delete($employeeId);
    }
}
