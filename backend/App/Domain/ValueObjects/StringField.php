<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Core\HttpStatus;
use App\Exceptions\ValidationException;

abstract readonly class StringField extends BaseField
{
    protected const ?int MIN_LEN = null;
    protected const ?int MAX_LEN = null;

    public function __construct(public string $value)
    {
        $className = (new \ReflectionClass($this))->getShortName();
        $len = mb_strlen($this->value, 'UTF-8');

        $minLen = static::MIN_LEN;
        if ($minLen !== null && $len < $minLen) {
            throw new ValidationException(
                "{$className} must be at least " . $minLen . ' characters',
                HttpStatus::UnprocessableEntity
            );
        }

        $maxLen = static::MAX_LEN;
        if ($maxLen !== null && $len > $maxLen) {
            throw new ValidationException(
                "{$className} must be at most " . $maxLen . ' characters',
                HttpStatus::UnprocessableEntity
            );
        }
    }
}
