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

        $allStatements = [];
        foreach ($sqlFiles as $file) {
            if (!is_readable($file)) {
                throw new \RuntimeException("SQL file not found or not readable: {$file}");
            }

            $sql = file_get_contents($file);

            // Parse file into executable statements
            $statements = $this->splitSqlStatements($sql);
            $allStatements = array_merge($allStatements, $statements);
        }

        $this->executeStatements($allStatements);
    }

    private function splitSqlStatements(string $sql): array
    {
        $statements = [];
        $current = '';
        $inTrigger = false;
        $lines = preg_split("/\r\n|\n|\r/", $sql);

        foreach ($lines as $rawLine) {
            $line = rtrim($rawLine, "\r\n");

            // Detect start of CREATE TRIGGER
            if (!$inTrigger && preg_match('/^\s*CREATE\s+(?:DEFINER\s*=\s*[^ ]+\s+)?TRIGGER\b/i', $line)) {
                $inTrigger = true;
            }

            $current .= $line . "\n";
            if ($inTrigger) {
                // If line ends with END or END, consider trigger finished
                if (preg_match('/\bEND\b\s*;?\s*$/i', trim($line))) {
                    $stmt = trim($current);
                    $stmt = preg_replace('/;+\s*$/', '', $stmt);
                    if ($stmt !== '') {
                        $statements[] = $stmt;
                    }

                    $current = '';
                    $inTrigger = false;
                }

                continue;
            }

            // Not in trigger
            if (strpos($line, ';') !== false) {
                // Append and then explode by semicolon
                $parts = explode(';', $current);
                $count = \count($parts);
                for ($i = 0; $i < $count - 1; ++$i) {
                    $stmt = trim($parts[$i]);
                    if ($stmt !== '') {
                        $statements[] = $stmt;
                    }
                }

                $current = $parts[$count - 1];
            }
        }

        $last = trim($current);
        if ($last !== '') {
            // Remove trailing semicolon
            $last = preg_replace('/;+\s*$/', '', $last);
            if ($last !== '') {
                $statements[] = $last;
            }
        }

        return $statements;
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
