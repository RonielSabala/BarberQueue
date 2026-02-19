<?php

declare(strict_types=1);

namespace App\Attributes;

#[\Attribute(\Attribute::TARGET_METHOD)]
class HttpRoute
{
    public function __construct(public readonly string $uri) {}

    public function getMethod(): string
    {
        return (new \ReflectionClass($this))->getShortName();
    }
}

#[\Attribute(\Attribute::TARGET_METHOD)]
class GET extends HttpRoute {}

#[\Attribute(\Attribute::TARGET_METHOD)]
class POST extends HttpRoute {}

#[\Attribute(\Attribute::TARGET_METHOD)]
class PUT extends HttpRoute {}

#[\Attribute(\Attribute::TARGET_METHOD)]
class PATCH extends HttpRoute {}

#[\Attribute(\Attribute::TARGET_METHOD)]
class DELETE extends HttpRoute {}
