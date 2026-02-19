<?php

declare(strict_types=1);

namespace Scripts\Utils;

class DatabaseInstaller
{
    public function __construct(private readonly \PDO $pdo) {}

    public function run(string $dbName, array $sqlFiles): void
    {
        $this->executeStatements([
            "DROP DATABASE IF EXISTS `{$dbName}`",
            "CREATE DATABASE `{$dbName}`",
            "USE `{$dbName}`",
        ]);

        foreach ($sqlFiles as $file) {
            $this->executeFromFile($file);
        }
    }

    private function executeFromFile(string $filepath): void
    {
        if (!file_exists($filepath)) {
            throw new \RuntimeException("File not found: {$filepath}");
        }

        $content = file_get_contents($filepath);
        $statements = array_filter(array_map('trim', explode(';', $content)));
        $this->executeStatements($statements);
    }

    private function executeStatements(array $statements): void
    {
        foreach ($statements as $stmt) {
            if (!empty($stmt)) {
                $this->pdo->exec($stmt);
            }
        }
    }
}
