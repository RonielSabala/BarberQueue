<?php

declare(strict_types=1);

namespace App\Attributes;

#[\Attribute(\Attribute::TARGET_METHOD)]
abstract readonly class HttpMethod
{
    public function __construct(public readonly string $uri) {}

    public function getName(): string
    {
        return (new \ReflectionClass($this))->getShortName();
    }
}

#[\Attribute(\Attribute::TARGET_METHOD)]
final readonly class GET extends HttpMethod {}

#[\Attribute(\Attribute::TARGET_METHOD)]
final readonly class POST extends HttpMethod {}

#[\Attribute(\Attribute::TARGET_METHOD)]
final readonly class PUT extends HttpMethod {}

#[\Attribute(\Attribute::TARGET_METHOD)]
final readonly class PATCH extends HttpMethod {}

#[\Attribute(\Attribute::TARGET_METHOD)]
final readonly class DELETE extends HttpMethod {}
