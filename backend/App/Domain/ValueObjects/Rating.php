<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\NumberField;

final readonly class Rating extends NumberField
{
    protected const int MIN_VALUE = 1;
    protected const int MAX_VALUE = 5;

    public function __construct(int|string $value)
    {
        parent::__construct((int) $value);
    }
}
