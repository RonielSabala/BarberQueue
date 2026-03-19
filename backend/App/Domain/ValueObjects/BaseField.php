<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Core\HttpStatus;
use App\Exceptions\ValidationException;

abstract class BaseField
{
    public $value;

    protected function throwValidationException(string $message): void
    {
        $className = (new \ReflectionClass($this))->getShortName();
        throw new ValidationException(
            "{$className} {$message}",
            HttpStatus::UnprocessableEntity
        );
    }
}
