<?php

declare(strict_types=1);

const SRC_DIR = __DIR__ . '/..';
const CREATION_FILE_PATH = __DIR__ . '/creation.sql';
const INSERTIONS_FILE_PATH = __DIR__ . '/insertions.sql';

require_once SRC_DIR . '/../vendor/autoload.php';
require_once SRC_DIR . '/config/db.php';

use App\Utils\Output;

function readSqlFile(string $filepath): string
{
    if (!file_exists($filepath)) {
        echo Output::error("File not found: $filepath");
        die;
    }

    $content = file_get_contents($filepath);
    if ($content === false) {
        echo Output::error("Failed to read file: $filepath");
        die;
    }

    return $content;
}

function getStatementsFromString(string $sql): array
{
    return array_filter(array_map('trim', explode(';', $sql)));
}

function executeStatements(\PDO $pdo, array $statements): void
{
    foreach ($statements as $stmt) {
        if (!empty($stmt)) {
            $pdo->exec($stmt);
        }
    }
}

// Validate database configuration
if (!isset($pdo) || !($pdo instanceof \PDO)) {
    echo Output::error("\PDO connection not available");
    die;
}

if (empty($dbName)) {
    echo Output::error("Database name cannot be empty");
    die;
}

$creationSql = readSqlFile(CREATION_FILE_PATH);
$insertionsSql = readSqlFile(INSERTIONS_FILE_PATH);

// Prepare statements
$initStatements = [
    "DROP DATABASE IF EXISTS `$dbName`",
    "CREATE DATABASE `$dbName`",
    "USE `$dbName`"
];
$creationStatements = getStatementsFromString($creationSql);
$insertionStatements = getStatementsFromString($insertionsSql);

// Execute installation
try {
    executeStatements($pdo, $initStatements);
    executeStatements($pdo, $creationStatements);
    executeStatements($pdo, $insertionStatements);

    echo Output::success("Database created successfully!");
} catch (\PDOException $e) {
    echo Output::error("Database error: " . $e->getMessage());
    die;
}
