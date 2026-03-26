<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\DecimalField;

final readonly class AverageRating extends DecimalField
{
    protected const float MIN_VALUE = 1.0;
    protected const float MAX_VALUE = 5.0;
}
