<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\NameField;

final readonly class BarbershopName extends NameField
{
    protected const int MIN_LEN = 5;
    protected const int MAX_LEN = 100;
}
