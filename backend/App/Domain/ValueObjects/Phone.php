<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

class Phone extends StringField
{
    protected const MIN_LEN = 12;
    protected const MAX_LEN = 20;
}
