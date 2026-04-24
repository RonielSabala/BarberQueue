<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects\Base;

abstract readonly class BaseField
{
    public mixed $value;

    protected function undefinedFieldException(string $field): \RuntimeException
    {
        return new \RuntimeException(static::class . "::{$field} must be defined");
    }
}
