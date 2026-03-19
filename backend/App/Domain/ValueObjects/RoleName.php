<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

class RoleName extends StringField
{
    protected const MIN_LEN = 5;
    protected const MAX_LEN = 9;
}
