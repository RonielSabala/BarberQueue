<?php

declare(strict_types=1);

namespace App\Config;

use Monolog\Formatter\LineFormatter;
use Monolog\Handler\StreamHandler;
use Monolog\{Level, LogRecord, Logger};

class ColoredLineFormatter extends LineFormatter
{
    private const ANSI_RESET = "\e[0m";

    private static function levelColors(): array
    {
        return [
            Level::Debug->value => "\e[37m",
            Level::Info->value => "\e[32m",
            Level::Notice->value => "\e[36m",
            Level::Warning->value => "\e[33m",
            Level::Error->value => "\e[31m",
            Level::Critical->value => "\e[1;31m",
            Level::Alert->value => "\e[1;33m",
            Level::Emergency->value => "\e[1;35m",
        ];
    }

    public function format(LogRecord $record): string
    {
        $line = parent::format($record);
        $color = self::levelColors()[$record->level->value] ?? self::ANSI_RESET;
        return $color . $line . self::ANSI_RESET;
    }
}

class LoggerProvider
{
    private static ?Logger $logger = null;

    public static function get(): Logger
    {
        if (self::$logger !== null) {
            return self::$logger;
        }

        $logger = new Logger('app');
        $handler = new StreamHandler('php://stderr', Level::Debug);

        $formatter = new ColoredLineFormatter(
            "[%datetime%] [%level_name%] %message% %context%\n",
            'Y-m-d H:i:s',
            true,
            true
        );

        $handler->setFormatter($formatter);
        $logger->pushHandler($handler);

        self::$logger = $logger;
        return $logger;
    }
}
