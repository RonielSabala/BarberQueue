<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\NumberField;

final class AverageRating extends NumberField
{
    protected const float MIN = 0.0;
    protected const float MAX = 5.0;
}
