<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\DTOs\BaseRequest;
use App\Exceptions\ServiceException;

class BaseService
{
    protected function getEnvVariable(string $variableName): string
    {
        $value = $_ENV[$variableName] ?? null;
        if (!$value) {
            throw new ServiceException("`{$variableName}` is not defined in the environment.", HttpStatus::InternalServerError);
        }

        return $value;
    }

    protected function validateFieldsToUpdate(BaseRequest $request): array
    {
        $fields = $request->toUpdateArray();
        if (empty($fields)) {
            throw new ServiceException(
                'At least one field must be provided for update',
                HttpStatus::BadRequest
            );
        }

        return $fields;
    }
}
