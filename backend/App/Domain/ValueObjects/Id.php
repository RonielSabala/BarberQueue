<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

class Id extends BaseField
{
    public int $value;

    public function __construct(string $value)
    {
        $this->value = (int) $value;
    }
}
