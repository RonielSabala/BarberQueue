<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects\Base;

abstract readonly class NumberField extends BaseField
{
    protected const int|float|null MIN_VALUE = null;
    protected const int|float|null MAX_VALUE = null;

    public function __construct(float|int $value)
    {
        $minValue = static::MIN_VALUE;
        $maxValue = static::MAX_VALUE;

        if ($minValue !== null && $value < $minValue) {
            throw $this->validationException("must be >= {$minValue} (got {$value})");
        }

        if ($maxValue !== null && $value > $maxValue) {
            throw $this->validationException("must be <= {$maxValue} (got {$value})");
        }

        $this->value = $value;
    }
}
