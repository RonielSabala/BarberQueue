<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

use App\Utils\OutputUtils;
use Config\DbConfig;

function getStatementsFromFile(string $filepath): array
{
    if (!file_exists($filepath)) {
        echo OutputUtils::error("File not found: {$filepath}");
        exit;
    }

    $content = file_get_contents($filepath);
    if ($content === false) {
        echo OutputUtils::error("Failed to read file: {$filepath}");
        exit;
    }

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

// Prepare statements
$dbName = DbConfig::getDbName();
$initStatements = [
    "DROP DATABASE IF EXISTS `{$dbName}`",
    "CREATE DATABASE `{$dbName}`",
    "USE `{$dbName}`",
];

$creationStatements = getStatementsFromFile(__DIR__ . '/creation.sql');
$insertionStatements = getStatementsFromFile(__DIR__ . '/insertions.sql');

// Execute installation
try {
    $pdo = DbConfig::getPdo();
    executeStatements($pdo, $initStatements);
    executeStatements($pdo, $creationStatements);
    executeStatements($pdo, $insertionStatements);

    echo OutputUtils::success('Database created successfully!');
} catch (\PDOException $e) {
    echo OutputUtils::error('Database error: ' . $e->getMessage());
}
