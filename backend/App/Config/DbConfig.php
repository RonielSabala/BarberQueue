<?php

declare(strict_types=1);

namespace App\Config;

use App\Utils\EnvUtils;

class DbConfig
{
    private static \PDO $pdo;
    private static string $dbName;
    private const CONNECTION_STRING_TEMPLATE = 'mysql:host=%s;port=%s;charset=utf8mb4%s';

    public static function init(bool $withDatabase = true, bool $isTest = false): void
    {
        $dbName = EnvUtils::get('DB_DATABASE');
        if (empty($dbName)) {
            throw new \RuntimeException('Database name cannot be empty');
        }

        if ($isTest) {
            $dbName .= '_tests';
        }

        $dsn = \sprintf(
            self::CONNECTION_STRING_TEMPLATE,
            EnvUtils::get('DB_HOST'),
            EnvUtils::get('DB_PORT'),
            $withDatabase ? ";dbname={$dbName}" : '',
        );

        self::$dbName = $dbName;
        self::$pdo = new \PDO(
            $dsn,
            EnvUtils::get('DB_USERNAME'),
            EnvUtils::get('DB_PASSWORD'),
            [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
                \PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    }

    public static function getConnection(): \PDO
    {
        return self::$pdo;
    }

    public static function getDbName(): string
    {
        return self::$dbName;
    }
}
