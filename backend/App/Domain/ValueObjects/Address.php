<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

final class Address extends StringField
{
    protected const int MIN_LEN = 12;
    protected const int MAX_LEN = 255;
}
