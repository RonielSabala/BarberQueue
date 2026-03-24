<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\NumberField;

final readonly class Id extends NumberField
{
    protected const int MIN_VALUE = 1;

    public function __construct(int|string $value)
    {
        parent::__construct((int) $value);
    }
}
