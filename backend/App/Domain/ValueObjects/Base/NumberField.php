<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects\Base;

abstract class NumberField extends BaseField
{
    protected const int|float|null MIN_VALUE = null;
    protected const int|float|null MAX_VALUE = null;

    public function __construct(float|int $value)
    {
        $min = static::MIN_VALUE;
        if ($min !== null && $value < $min) {
            throw $this->validationException("must be greater or equal than {$min}");
        }

        $max = static::MAX_VALUE;
        if ($max !== null && $value > $max) {
            throw $this->validationException("must be less or equal than {$max}");
        }

        $this->value = $value;
    }
}
