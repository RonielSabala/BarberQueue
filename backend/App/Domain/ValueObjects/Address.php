<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\StringField;

final class Address extends StringField
{
    protected const int MIN_LEN = 12;
}
