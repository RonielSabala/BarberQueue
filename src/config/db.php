<?php
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

// Database connection variables
$port = 3306;
$host = $_ENV['HOST'];
$user = $_ENV['USER'];
$pass = $_ENV['PASS'];

$dsn = "mysql:host={$host};port={$port};charset=utf8mb4";

// Create PDO singleton
try {
    $pdo = new PDO($dsn, $user, $pass);
} catch (PDOException $e) {
    error_log("DB connect error: " . $e->getMessage());
    throw $e;
}
