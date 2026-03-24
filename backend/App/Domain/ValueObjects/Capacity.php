<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\NumberField;

final class Capacity extends NumberField
{
    protected const int MIN_VALUE = 1;
    protected const int MAX_VALUE = 50;
}
