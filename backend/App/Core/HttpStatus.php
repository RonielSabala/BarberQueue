<?php

declare(strict_types=1);

namespace App\Core;

enum HttpStatus: int
{
    case Ok = 200;
    case NotFound = 404;

    public function response(): void
    {
        http_response_code($this->value);
    }
}
