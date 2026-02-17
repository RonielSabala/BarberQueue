<?php

declare(strict_types=1);

namespace App\Components;

abstract class BaseComponent
{
    abstract public function render(): string;

    public function __toString(): string
    {
        return $this->render();
    }
}
