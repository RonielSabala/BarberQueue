<?php

declare(strict_types=1);

namespace App\Services\Barbershop;

use App\Core\HttpStatus;
use App\Domain\Enums\EmployeeRoleEnum;
use App\Domain\ValueObjects\DayOfWeek;
use App\Exceptions\Barbershop\BarbershopEmployeeException;
use App\DTOs\Barbershops\Requests\{
    AssignBarbershopEmployeeRequest,
    CreateBarbershopEmployeeRequest
};
use App\DTOs\Barbershops\Responses\{
    BarbershopEmployeeResponse,
    CreateBarbershopEmployeeResponse
};
use App\Repositories\{
    Barbershop\BarbershopRepository,
    AssignmentRepository,
    EmployeeRepository,
    RoleRepository,
    UserRepository,
    WorkingDayRepository
};
use App\Services\{BaseService, PasswordService, UserService};

final readonly class BarbershopEmployeeService extends BaseService
{
    private const array WEEK_DAYS = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];

    public function __construct(
        private readonly RoleRepository $roleRepository,
        private readonly WorkingDayRepository $workingDayRepository,
        private readonly AssignmentRepository $assignmentRepository,
        private readonly EmployeeRepository $employeeRepository,
        private readonly UserRepository $userRepository,
        private readonly BarbershopRepository $barbershopRepository,
        private readonly PasswordService $passwordService,
        private readonly UserService $userService,
        private readonly BarbershopService $barbershopService,
    ) {}

    private function validateEmployeeRole(string $role): void
    {
        if (
            !\in_array($role, [
                EmployeeRoleEnum::Barber->value,
                EmployeeRoleEnum::Assistant->value,
            ], true)
        ) {
            throw new BarbershopEmployeeException(
                'Only barbers and assistants can be employees',
                HttpStatus::UnprocessableEntity
            );
        }
    }

    public function validateEmployeeWorkingHours(
        string $startTime,
        string $endTime,
        string $barbershopOpensAt,
        string $barbershopClosesAt,
    ): void {
        if ($startTime === $endTime) {
            throw new BarbershopEmployeeException(
                'Start time must be different from end time',
                HttpStatus::UnprocessableEntity
            );
        }

        if ($startTime > $endTime) {
            throw new BarbershopEmployeeException(
                'Start time must be earlier than end time',
                HttpStatus::UnprocessableEntity
            );
        }

        if ($startTime < $barbershopOpensAt) {
            throw new BarbershopEmployeeException(
                'Start time cannot be earlier than the barbershop opening time',
                HttpStatus::UnprocessableEntity
            );
        }

        if ($endTime > $barbershopClosesAt) {
            throw new BarbershopEmployeeException(
                'End time cannot be later than the barbershop closing time',
                HttpStatus::UnprocessableEntity
            );
        }
    }

    /** @param int[] $workingDays */
    public function validateEmployeeWorkingDays(
        int $employeeId,
        int $barbershopId,
        string $startTime,
        string $endTime,
        array $workingDays,
    ): void {
        // Validate no schedule conflicts with other barbershops
        $conflictingDays = $this->assignmentRepository->findConflictingDays(
            staffId: $employeeId,
            excludeBarbershopId: $barbershopId,
            startTime: $startTime,
            endTime: $endTime,
            days: $workingDays
        );

        if (!empty($conflictingDays)) {
            $dayNames = array_map(
                static fn (int $day) => self::WEEK_DAYS[$day - 1],
                $conflictingDays
            );
            throw new BarbershopEmployeeException(
                'The employee already has an overlapping schedule on ' . implode(', ', $dayNames),
                HttpStatus::Conflict
            );
        }
    }

    /** @return BarbershopEmployeeResponse[] */
    public function getEmployees(int $barbershopId): array
    {
        $this->barbershopService->validateBarbershopExists($barbershopId);
        $employees = $this->employeeRepository->getAllByBarbershopId($barbershopId);
        return BarbershopEmployeeResponse::fromEntities($employees);
    }

    public function createEmployee(int $barbershopId, CreateBarbershopEmployeeRequest $request): CreateBarbershopEmployeeResponse
    {
        $barbershop = $this->barbershopService->validateBarbershopExists($barbershopId);

        $email = $request->email->value;
        $this->userService->validateInexistentUserEmail($email);

        $role = $this->roleRepository->getByValue($request->role->value);
        $roleName = $role->roleName->value;
        $this->validateEmployeeRole($roleName);

        $startTime = $request->startTime->value;
        $endTime = $request->endTime->value;
        $this->validateEmployeeWorkingHours(
            startTime: $startTime,
            endTime: $endTime,
            barbershopOpensAt: $barbershop->opensAt->value,
            barbershopClosesAt: $barbershop->closesAt->value,
        );

        $employeeId = $this->barbershopRepository->transaction(function () use (
            $request,
            $barbershopId,
            $role,
            $email,
            $startTime,
            $endTime,
        ) {
            // Create employee
            $userId = $this->userRepository->createUser(
                $role->id->value,
                $request->username->value,
                $email,
                $request->phone->value,
                $this->passwordService->hash($request->password->value),
            );

            // Create assignment
            $this->assignmentRepository->createAssignment(
                staffId: $userId,
                barbershopId: $barbershopId,
                startTime: $startTime,
                endTime: $endTime
            );
            $this->workingDayRepository->createWorkingDays(
                staffId: $userId,
                barbershopId: $barbershopId,
                days: array_map(
                    static fn ($day) => $day->value,
                    $request->workingDays
                )
            );

            return $userId;
        });

        return new CreateBarbershopEmployeeResponse(
            id: $employeeId,
            username: $request->username->value,
            email: $email,
            role: $roleName
        );
    }

    public function assignEmployee(
        int $barbershopId,
        int $employeeId,
        AssignBarbershopEmployeeRequest $request
    ): void {
        $barbershop = $this->barbershopService->validateBarbershopExists($barbershopId);
        $employee = $this->userService->validateUserExists($employeeId);

        $this->validateEmployeeRole($employee->role->value);

        // Validate not already assigned
        if ($this->assignmentRepository->assignmentExists($employeeId, $barbershopId)) {
            throw new BarbershopEmployeeException(
                'Employee is already assigned to this barbershop',
                HttpStatus::Conflict
            );
        }

        $startTime = $request->startTime->value;
        $endTime = $request->endTime->value;
        $days = array_map(
            static fn (DayOfWeek $day) => $day->value,
            $request->workingDays
        );

        $this->validateEmployeeWorkingHours(
            startTime: $startTime,
            endTime: $endTime,
            barbershopOpensAt: $barbershop->opensAt->value,
            barbershopClosesAt: $barbershop->closesAt->value,
        );
        $this->validateEmployeeWorkingDays(
            employeeId: $employeeId,
            barbershopId: $barbershopId,
            startTime: $startTime,
            endTime: $endTime,
            workingDays: $days,
        );

        // Create the assignment
        $this->barbershopRepository->transaction(function () use (
            $barbershopId,
            $employeeId,
            $startTime,
            $endTime,
            $days,
        ): void {
            $this->assignmentRepository->createAssignment(
                staffId: $employeeId,
                barbershopId: $barbershopId,
                startTime: $startTime,
                endTime: $endTime
            );
            $this->workingDayRepository->createWorkingDays(
                staffId: $employeeId,
                barbershopId: $barbershopId,
                days: $days
            );
        });
    }

    public function deleteEmployeeAssignment(int $barbershopId, int $employeeId): bool
    {
        $this->barbershopService->validateBarbershopExists($barbershopId);

        $success = $this->assignmentRepository->deleteAssignment($employeeId, $barbershopId);
        return $success && $this->workingDayRepository->deleteWorkingDays($employeeId, $barbershopId);
    }
}
