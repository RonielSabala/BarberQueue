<?php

declare(strict_types=1);

namespace App\Attributes;

#[\Attribute(\Attribute::TARGET_PROPERTY | \Attribute::TARGET_PARAMETER)]
class ArrayOf
{
    public function __construct(public readonly string $type) {}
}
