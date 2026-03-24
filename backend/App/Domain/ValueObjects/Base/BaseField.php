<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects\Base;

use App\Core\HttpStatus;
use App\Exceptions\ValidationException;

abstract class BaseField
{
    public $value;

    protected function validationException(string $message): ValidationException
    {
        $className = (new \ReflectionClass($this))->getShortName();
        return new ValidationException(
            "{$className} {$message}",
            HttpStatus::UnprocessableEntity
        );
    }
}
