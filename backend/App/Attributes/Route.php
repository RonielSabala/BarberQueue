<?php

declare(strict_types=1);

namespace App\Attributes;

#[\Attribute(\Attribute::TARGET_METHOD)]
class Route
{
    public function __construct(public readonly string $uri) {}

    public function getMethod(): string
    {
        return (new \ReflectionClass($this))->getShortName();
    }
}

#[\Attribute(\Attribute::TARGET_METHOD)]
class GET extends Route {}

#[\Attribute(\Attribute::TARGET_METHOD)]
class POST extends Route {}

#[\Attribute(\Attribute::TARGET_METHOD)]
class PUT extends Route {}

#[\Attribute(\Attribute::TARGET_METHOD)]
class PATCH extends Route {}

#[\Attribute(\Attribute::TARGET_METHOD)]
class DELETE extends Route {}
