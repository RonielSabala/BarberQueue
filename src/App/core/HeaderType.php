<?php

declare(strict_types=1);

namespace App\Core;

enum HeaderType: string
{
    case Json = 'application/json';
    case PlainText = 'text/plain';

    public function header(): string
    {
        return "Content-Type: {$this->value}; charset=utf-8";
    }
}
