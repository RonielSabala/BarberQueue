<?php

declare(strict_types=1);

namespace App\Controllers\Core;

use App\Core\View;

abstract class Controller
{
    public function __construct(
        public readonly ?string $viewTabName = null,
    ) {}

    abstract public function handle(View $view): void;
}
