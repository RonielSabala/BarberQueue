<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\IntegerField;

final readonly class Id extends IntegerField
{
    protected const int MIN_VALUE = 1;
}
