<?php

declare(strict_types=1);

namespace App\Attributes;

#[\Attribute(\Attribute::TARGET_PROPERTY | \Attribute::TARGET_PARAMETER)]
class ArrayOf
{
    public function __construct(
        public readonly string $type,
        public readonly int $minItems = 0,
        public readonly ?int $maxItems = null,
    ) {
        if ($this->minItems < 0) {
            throw new \RuntimeException('minItems must be >= 0');
        }

        if ($this->maxItems !== null && $this->maxItems < $this->minItems) {
            throw new \RuntimeException('maxItems must be >= minItem');
        }
    }
}
