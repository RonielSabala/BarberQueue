<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Domain\Entities\Employee;
use App\Domain\ValueObjects\Role;
use App\DTOs\Employee\Requests\UpdateEmployeeAssignmentRequest;
use App\DTOs\Employee\Responses\EmployeeResponse;
use App\Exceptions\EmployeeException;
use App\Repositories\{AssignmentsRepository, EmployeeRepository, RoleRepository, UserRepository, WorkingDaysRepository};

class EmployeeService extends BaseService
{
    public function __construct(
        private readonly BarbershopService $barbershopService,
        private readonly RoleRepository $roleRepository,
        private readonly UserRepository $userRepository,
        private readonly AssignmentsRepository $assignmentsRepository,
        private readonly WorkingDaysRepository $workingDaysRepository,
        private readonly EmployeeRepository $employeeRepository
    ) {}

    private function validateEmployee(int $employeeId): Employee
    {
        $user = $this->userRepository->findById($employeeId);
        if ($user === null) {
            throw new EmployeeException('Employee not found', HttpStatus::NotFound);
        }

        $role = $this->roleRepository->findByValue($user->role->value);
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

        return new Employee(
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

        if (!$this->assignmentsRepository->exists($employeeId, $barbershopId)) {
            throw new EmployeeException('Assignment not found', HttpStatus::NotFound);
        }

        $fields = $this->validateFieldsToUpdate($request);

        $this->employeeRepository->transaction(
            function () use ($employeeId, $barbershopId, $fields): void {
                $this->assignmentsRepository->updateAssignment($employeeId, $barbershopId, $fields);

                $days = $fields['working_days'] ?? null;
                if (!$days) {
                    return;
                }

                $this->workingDaysRepository->deleteDays($employeeId, $barbershopId);
                $this->workingDaysRepository->createDays($employeeId, $barbershopId, $days);
            }
        );
    }

    public function deleteEmployee(int $employeeId): bool
    {
        $this->validateEmployee($employeeId);
        return $this->employeeRepository->delete($employeeId);
    }
}
