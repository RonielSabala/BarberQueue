<?php
const BASE_DIR = __DIR__ . '/../';
const CREATION_FILE_PATH = __DIR__ . '/creation.sql';
const INSERTIONS_FILE_PATH = __DIR__ . '/insertions.sql';

require_once BASE_DIR . 'vendor/autoload.php';
require_once BASE_DIR . 'config/db.php';

// Read SQL scripts
$creationSql = file_get_contents(CREATION_FILE_PATH);
if (!$creationSql) {
    die("The file could not be read to create the database");
}

$insertionsSql = file_get_contents(INSERTIONS_FILE_PATH);
if (!$insertionsSql) {
    die("The file could not be read to insert the data");
}

try {
    // Create tables
    $pdo = new PDO("mysql:host=$host", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

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
