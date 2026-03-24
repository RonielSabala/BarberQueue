<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

final class Capacity extends NumberField
{
    protected const int MIN = 1;
}
