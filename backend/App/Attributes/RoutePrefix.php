<?php

declare(strict_types=1);

namespace App\Attributes;

#[\Attribute(\Attribute::TARGET_CLASS)]
class RoutePrefix
{
    public function __construct(public readonly string $prefix) {}
}
