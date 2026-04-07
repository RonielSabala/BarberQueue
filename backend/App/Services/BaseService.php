<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\DTOs\BaseRequest;
use App\Exceptions\Base\ServiceException;

abstract readonly class BaseService
{
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
