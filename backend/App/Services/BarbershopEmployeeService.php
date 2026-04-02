<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Domain\Enums\RoleEnum;
use App\DTOs\Barbershops\Requests\CreateBarbershopEmployeeRequest;
use App\Exceptions\BarbershopEmployeeException;
use App\DTOs\Barbershops\Responses\{
    BarbershopEmployeeResponse,
    CreateBarbershopEmployeeResponse
};
use App\Repositories\{
    AssignmentRepository,
    BarbershopRepository,
    EmployeeRepository,
    RoleRepository,
    UserRepository,
    WorkingDayRepository
};

class BarbershopEmployeeService extends BaseService
{
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

    /** @return BarbershopEmployeeResponse[] */
    public function getEmployees(int $barbershopId): array
    {
        $this->barbershopService->validateBarbershopExists($barbershopId);
        $employees = $this->employeeRepository->getAllByBarbershopId($barbershopId);
        return BarbershopEmployeeResponse::fromEntities($employees);
    }

    public function createEmployee(int $barbershopId, CreateBarbershopEmployeeRequest $request): CreateBarbershopEmployeeResponse
    {
        $this->barbershopService->validateBarbershopExists($barbershopId);
        $this->userService->validateInexistentUserEmail($request->email->value);

        $role = $this->roleRepository->getByValue($request->role->value);
        $roleName = $role->roleName->value;
        if ($roleName === RoleEnum::Client->value || $roleName === RoleEnum::Admin->value) {
            throw new BarbershopEmployeeException(
                'Only barbers and assistants can be assigned to a barbershop',
                HttpStatus::UnprocessableEntity
            );
        }

        $employeeId = $this->barbershopRepository->transaction(function () use (
            $barbershopId,
            $request,
            $role,
        ) {
            $userId = $this->userRepository->createUser(
                $role->id->value,
                $request->username->value,
                $request->email->value,
                $request->phone->value,
                $this->passwordService->hash($request->password->value),
            );
            $this->assignmentRepository->createAssignment(
                $userId,
                $barbershopId,
                $request->startTime->value,
                $request->endTime->value
            );
            $this->workingDayRepository->createWorkingDays(
                $userId,
                $barbershopId,
                array_map(static fn ($day) => $day->value, $request->workingDays)
            );

            return $userId;
        });

        return new CreateBarbershopEmployeeResponse(
            id: $employeeId,
            username: $request->username->value,
            email: $request->email->value,
            role: $roleName
        );
    }

    public function deleteEmployeeAssignment(int $barbershopId, int $employeeId): bool
    {
        $this->barbershopService->validateBarbershopExists($barbershopId);
        return $this->assignmentRepository->deleteAssignment($employeeId, $barbershopId);
    }
}
