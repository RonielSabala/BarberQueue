<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects\Base;

abstract readonly class IntegerField extends NumberField
{
    protected const ?int MIN_VALUE = null;
    protected const ?int MAX_VALUE = null;

    public function __construct(int|string $value)
    {
        parent::__construct((int) $value);
    }
}
