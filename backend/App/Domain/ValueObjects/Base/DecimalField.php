<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects\Base;

abstract readonly class DecimalField extends NumberField
{
    protected const ?float MIN_VALUE = null;
    protected const ?float MAX_VALUE = null;

    public function __construct(float|string $value)
    {
        parent::__construct((float) $value);
    }
}
