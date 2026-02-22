<?php

declare(strict_types=1);

namespace App\Config;

class DbConfig
{
    private static \PDO $pdo;
    private static string $dbName;
    private const CONNECTION_STRING_TEMPLATE = 'mysql:host=%s;port=%s;charset=utf8mb4%s';

    public static function init(bool $withDatabase = true): void
    {
        $dbName = $_ENV['DB_DATABASE'];
        if (empty($dbName)) {
            throw new \RuntimeException('Database name cannot be empty');
        }

        $dsn = \sprintf(
            self::CONNECTION_STRING_TEMPLATE,
            $_ENV['DB_HOST'],
            $_ENV['DB_PORT'],
            $withDatabase ? ";dbname={$dbName}" : '',
        );

        self::$dbName = $dbName;
        self::$pdo = new \PDO(
            $dsn,
            $_ENV['DB_USERNAME'],
            $_ENV['DB_PASSWORD'],
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
