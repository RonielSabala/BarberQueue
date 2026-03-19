<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

readonly class Token extends StringField
{
    protected const MIN_LEN = 255;
    protected const MAX_LEN = 255;
}
