<?php

declare(strict_types=1);

namespace App\Attributes;

#[\Attribute(\Attribute::TARGET_METHOD)]
class HttpMethod
{
    public function __construct(public readonly string $uri) {}

    public function getName(): string
    {
        return (new \ReflectionClass($this))->getShortName();
    }
}

#[\Attribute(\Attribute::TARGET_METHOD)]
class GET extends HttpMethod {}

#[\Attribute(\Attribute::TARGET_METHOD)]
class POST extends HttpMethod {}

#[\Attribute(\Attribute::TARGET_METHOD)]
class PUT extends HttpMethod {}

#[\Attribute(\Attribute::TARGET_METHOD)]
class PATCH extends HttpMethod {}

#[\Attribute(\Attribute::TARGET_METHOD)]
class DELETE extends HttpMethod {}
