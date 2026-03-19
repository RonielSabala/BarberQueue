<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

class Password extends StringField
{
    protected const MIN_LEN = 8;
    protected const MAX_LEN = 50;
}
