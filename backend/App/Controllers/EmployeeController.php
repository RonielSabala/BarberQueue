<?php

declare(strict_types=1);

namespace App\Controllers;

use App\DTOs\Employees\Requests\UpdateEmployeeAssignmentRequest;
use App\Services\EmployeeService;
use App\Attributes\{DELETE, GET, PATCH, RoutePrefix};
use App\Core\{HttpResponse, HttpStatus};

#[RoutePrefix('/api/employees')]
final readonly class EmployeeController extends BaseController
{
    public function __construct(
        private readonly EmployeeService $employeeService
    ) {}

    #[GET('/{id}')]
    public function get(int $id): void
    {
        $response = $this->employeeService->get($id);
        HttpResponse::json($response);
    }

    #[PATCH('/{id}/barbershop/{barbershopId}')]
    public function update(int $id, int $barbershopId, UpdateEmployeeAssignmentRequest $request): void
    {
        $this->employeeService->updateEmployeeAssignment($id, $barbershopId, $request);
        HttpResponse::success('Employee updated');
    }

    #[DELETE('/{id}')]
    public function delete(int $id): void
    {
        $success = $this->employeeService->deleteEmployee($id);
        if (!$success) {
            HttpResponse::error('Employee not found', HttpStatus::NotFound);
            return;
        }

        HttpResponse::json(null, HttpStatus::NoContent);
    }
}
