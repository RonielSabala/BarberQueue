<?php

declare(strict_types=1);
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

// Database connection variables
$host = $_ENV['DB_HOST'];
$port = $_ENV['DB_PORT'];
$user = $_ENV['DB_USERNAME'];
$pass = $_ENV['DB_PASSWORD'];
$dbName = $_ENV['DB_DATABASE'];

$dsn = "mysql:host={$host};port={$port};charset=utf8mb4";

// Create PDO singleton
try {
    $pdo = new \PDO($dsn, $user, $pass);
} catch (\PDOException $e) {
    error_log('DB connect error: ' . $e->getMessage());
    throw $e;
}
