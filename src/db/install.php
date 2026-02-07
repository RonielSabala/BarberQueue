<?php
const SRC_DIR = __DIR__ . '/../';
const CREATION_FILE_PATH = __DIR__ . '/creation.sql';
const INSERTIONS_FILE_PATH = __DIR__ . '/insertions.sql';

require_once SRC_DIR . 'vendor/autoload.php';
require_once SRC_DIR . 'config/db.php';

// Read SQL scripts
$creationSql = @file_get_contents(CREATION_FILE_PATH);
if ($creationSql === false) {
    die("Failed to read database creation file: " . CREATION_FILE_PATH);
}

$insertionsSql = @file_get_contents(INSERTIONS_FILE_PATH);
if ($insertionsSql === false) {
    die("Failed to read data insertion file: " . INSERTIONS_FILE_PATH);
}

try {
    $statements = array_filter(array_map('trim', explode(';', $creationSql)));
    foreach ($statements as $stmt) {
        if (!empty($stmt)) {
            $pdo->exec($stmt);
        }
    }

    // Use db
    if (!empty($db)) {
        $pdo->exec("USE `$db`;");
    }

    // Insert data
    $insertStatements = array_filter(array_map('trim', explode(';', $insertionsSql)));
    foreach ($insertStatements as $stmt) {
        if (!empty($stmt)) {
            $pdo->exec($stmt);
        }
    }
} catch (PDOException $e) {
    die("DB error: " . $e->getMessage());
}

echo "✔️  Database created successfully\n";
