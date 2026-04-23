<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects\Base;

use App\Core\HttpStatus;
use App\Exceptions\Base\ValidationException;

abstract readonly class BaseField
{
    public mixed $value;

    protected function validationException(string $message): ValidationException
    {
        $className = (new \ReflectionClass($this))->getShortName();
        return new ValidationException(
            "{$className} {$message}",
            HttpStatus::UnprocessableEntity
        );
    }

    protected function undefinedFieldException(string $field): \RuntimeException
    {
        return new \RuntimeException(static::class . "::{$field} must be defined");
    }
}
