<?php

declare(strict_types=1);

const SRC_DIR = __DIR__ . '/..';
const CREATION_FILE_PATH = __DIR__ . '/creation.sql';
const INSERTIONS_FILE_PATH = __DIR__ . '/insertions.sql';

require_once SRC_DIR . '/../vendor/autoload.php';

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

DbConfig::init();
$pdo = DbConfig::getPdo();
$dbName = DbConfig::getDbName();

// Prepare statements
$initStatements = [
    "DROP DATABASE IF EXISTS `{$dbName}`",
    "CREATE DATABASE `{$dbName}`",
    "USE `{$dbName}`",
];
$creationStatements = getStatementsFromFile(CREATION_FILE_PATH);
$insertionStatements = getStatementsFromFile(INSERTIONS_FILE_PATH);

// Execute installation
try {
    executeStatements($pdo, $initStatements);
    executeStatements($pdo, $creationStatements);
    executeStatements($pdo, $insertionStatements);

    echo OutputUtils::success('Database created successfully!');
} catch (\PDOException $e) {
    echo OutputUtils::error('Database error: ' . $e->getMessage());
}
