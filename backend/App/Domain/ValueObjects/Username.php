<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

readonly class Username extends StringField
{
    protected const MIN_LEN = 5;
    protected const MAX_LEN = 30;
}
