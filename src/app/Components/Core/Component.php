<?php

declare(strict_types=1);

namespace App\Components\Core;

abstract class Component
{
    abstract public function render(): string;

    public function __toString(): string
    {
        return $this->render();
    }
}
