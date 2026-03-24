<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Config\DbConfig;
use App\Utils\TextUtils;

abstract class BaseRepository
{
    protected \PDO $db;

    protected const ?string TABLE_NAME = null;
    protected const ?array ALLOWED_FIELDS = null;

    public function __construct()
    {
        $this->db = DbConfig::getConnection();
    }

    private function missingVariablesException(string $varName): \RuntimeException
    {
        return new \RuntimeException("Repository `{$varName}` variable is not set");
    }

    protected function mapToEntity(string $entityClass, array $row): object
    {
        $reflection = new \ReflectionClass($entityClass);
        $constructor = $reflection->getConstructor();

        if (!$constructor) {
            return new $entityClass();
        }

        $arguments = [];
        foreach ($constructor->getParameters() as $param) {
            $dbKey = TextUtils::toSnakeCase($param->getName());
            $dbValue = $row[$dbKey] ?? null;

            // Resolve Type
            $type = $param->getType();
            if ($type && !$type->isBuiltin() && $dbValue !== null) {
                // Instantiate Value Object
                $className = $type->getName();
                $arguments[] = new $className($dbValue);
            } else {
                $arguments[] = $dbValue;
            }
        }

        return $reflection->newInstanceArgs($arguments);
    }

    protected function query(string $sql, array $params = []): \PDOStatement
    {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    protected function fetchOne(string $entityClass, string $sql, array $params = []): ?object
    {
        $stmt = $this->query($sql, $params);
        $row = $stmt->fetch();

        return $row ? $this->mapToEntity($entityClass, $row) : null;
    }

    protected function fetchAll(string $entityClass, string $sql, array $params = []): array
    {
        $stmt = $this->query($sql, $params);
        $results = [];

        while ($row = $stmt->fetch()) {
            $results[] = $this->mapToEntity($entityClass, $row);
        }

        return $results;
    }

    public function updateFields(int $entityId, array $entityFields): void
    {
        if (empty($entityFields)) {
            return;
        }

        $tableName = static::TABLE_NAME;
        if ($tableName === null) {
            throw $this->missingVariablesException('TABLE_NAME');
        }

        $allowedFields = static::ALLOWED_FIELDS;
        if ($allowedFields === null) {
            throw $this->missingVariablesException('ALLOWED_FIELDS');
        }

        $keys = array_keys($entityFields);
        foreach ($keys as $field) {
            if (!\array_key_exists($field, $allowedFields)) {
                throw new \InvalidArgumentException("Unknown field: '{$field}'");
            }
        }

        $setClauses = implode(', ', array_map(
            static fn (string $field) => "{$field} = ?",
            $keys
        ));

        $sql = 'UPDATE ' . $tableName . " SET {$setClauses} WHERE id = ?";
        $this->query($sql, [...array_values($entityFields), $entityId]);
    }
}
