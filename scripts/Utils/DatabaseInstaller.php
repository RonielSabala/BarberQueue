<?php

declare(strict_types=1);

namespace Scripts\Utils;

class DatabaseInstaller
{
    public function __construct(private readonly \PDO $pdo) {}

    public function run(string $dbName, array $sqlFiles): void
    {
        if (empty($sqlFiles)) {
            throw new \InvalidArgumentException('At least one SQL file must be provided');
        }

        $this->executeStatements([
            "DROP DATABASE IF EXISTS `{$dbName}`",
            "CREATE DATABASE `{$dbName}`",
            "USE `{$dbName}`",
        ]);

        try {
            $this->pdo->exec('SET FOREIGN_KEY_CHECKS = 0');

            foreach ($sqlFiles as $file) {
                $this->executeFromFile($file);
            }

            $this->pdo->exec('SET FOREIGN_KEY_CHECKS = 1');
        } catch (\Throwable $e) {
            throw new \RuntimeException("Installation failed: {$e->getMessage()}", previous: $e);
        }
    }

    private function executeFromFile(string $filepath): void
    {
        if (!is_file($filepath) || !is_readable($filepath)) {
            throw new \RuntimeException("File not found or not readable: {$filepath}");
        }

        $content = file_get_contents($filepath);
        if ($content === false) {
            throw new \RuntimeException("Failed to read file: {$filepath}");
        }

        $statements = array_filter(array_map('trim', explode(';', $content)));
        if (empty($statements)) {
            throw new \RuntimeException("No valid SQL statements found in: {$filepath}");
        }

        $this->executeStatements($statements);
    }

    private function executeStatements(array $statements): void
    {
        foreach ($statements as $stmt) {
            if (empty($stmt)) {
                continue;
            }

            $this->pdo->exec($stmt);
        }
    }
}
