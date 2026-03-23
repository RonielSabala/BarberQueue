<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
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
}
