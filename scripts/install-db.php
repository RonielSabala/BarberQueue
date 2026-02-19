<?php

declare(strict_types=1);

require_once __DIR__ . '/../backend/bootstrap.php';

const DB_SCRIPTS_DIR = ROOT_DIR . '/database';

use App\Config\DbConfig;
use App\Utils\OutputUtils;

function getStatementsFromFile(string $filepath): array
{
    if (!file_exists($filepath)) {
        throw new \RuntimeException("File not found: {$filepath}");
    }

    $content = file_get_contents($filepath);
    return array_filter(array_map('trim', explode(';', $content)));
}

function executeStatements(\PDO $pdo, array $statements): void
{
    foreach ($statements as $stmt) {
        if (!empty($stmt)) {
            $pdo->exec($stmt);
        }
    }
}

try {
    DbConfig::init(withDatabase: false);
    $pdo = DbConfig::getConnection();
    $dbName = DbConfig::getDbName();

    $initStatements = [
        "DROP DATABASE IF EXISTS `{$dbName}`",
        "CREATE DATABASE `{$dbName}`",
        "USE `{$dbName}`",
    ];
    $creationStatements = getStatementsFromFile(DB_SCRIPTS_DIR . '/creation.sql');
    $insertionStatements = getStatementsFromFile(DB_SCRIPTS_DIR . '/insertions.sql');

    executeStatements($pdo, $initStatements);
    executeStatements($pdo, $creationStatements);
    executeStatements($pdo, $insertionStatements);

    echo OutputUtils::success('Database created successfully!');
} catch (\PDOException $e) {
    echo OutputUtils::error('Database error: ' . $e->getMessage());
}
