<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

class Username extends StringField
{
    protected const int MIN_LEN = 5;
    protected const int MAX_LEN = 30;
}
