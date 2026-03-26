<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\IntegerField;

final readonly class Capacity extends IntegerField
{
    protected const int MIN_VALUE = 1;
    protected const int MAX_VALUE = 50;
}
