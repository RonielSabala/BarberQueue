<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

class Id extends NumberField
{
    protected const int MIN = 0;

    public function __construct(int|string $value)
    {
        parent::__construct((int) $value);
    }
}
