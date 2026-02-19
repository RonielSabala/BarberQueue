<?php

declare(strict_types=1);

namespace Config;

use App\Utils\OutputUtils;

class DbConfig
{
    private static \PDO $pdo;
    private static string $dbName;

    public static function init(): void
    {
        self::$dbName = $_ENV['DB_DATABASE'];
        if (empty(self::$dbName)) {
            echo OutputUtils::error('Database name cannot be empty');
            exit;
        }

        // Connection variables
        $host = $_ENV['DB_HOST'];
        $port = $_ENV['DB_PORT'];
        $user = $_ENV['DB_USERNAME'];
        $pass = $_ENV['DB_PASSWORD'];
        $dsn = 'mysql:host=' . $host . ';port=' . $port . ';charset=utf8mb4';

        try {
            self::$pdo = new \PDO($dsn, $user, $pass);
        } catch (\PDOException $e) {
            echo OutputUtils::error('Database connection error: ' . $e->getMessage());
            throw $e;
        }
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
