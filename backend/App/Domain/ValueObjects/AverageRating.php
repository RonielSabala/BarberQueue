<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\NumberField;

final class AverageRating extends NumberField
{
    protected const float MIN_VALUE = 0.0;
    protected const float MAX_VALUE = 5.0;
}
