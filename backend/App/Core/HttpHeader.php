<?php

declare(strict_types=1);

namespace App\Core;

enum HttpHeader: string
{
    case Json = 'application/json';
    case PlainText = 'text/plain';

    public function header(): void
    {
        header("Content-Type: {$this->value}; charset=UTF-8");
    }
}
