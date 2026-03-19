<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

abstract class NumberField extends BaseField
{
    protected const ?int MIN = null;
    protected const ?int MAX = null;

    public function __construct(int $value)
    {
        $this->value = $value;

        $min = static::MIN;
        if ($min !== null && $value < $min) {
            $this->throwValidationException("must be greater or equal than {$min}");
        }

        $max = static::MAX;
        if ($max !== null && $value > $max) {
            $this->throwValidationException("must be less or equal than {$max}");
        }
    }
}
