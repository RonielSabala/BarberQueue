<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use App\Domain\ValueObjects\Base\StringField;

final readonly class Password extends StringField
{
    protected const int MIN_LEN = 8;
    protected const int MAX_LEN = 50;
}
