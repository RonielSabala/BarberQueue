<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Attributes\ArrayOf;
use App\Config\DbConfig;
use App\Domain\Entities\BaseEntity;
use App\Utils\TextUtils;

abstract class BaseRepository
{
    protected \PDO $db;

    protected const ?string TABLE_NAME = null;
    protected const ?array UPDATABLE_FIELDS = [];

    public function __construct()
    {
        $this->db = DbConfig::getConnection();
    }

    private function missingVariablesException(string $varName): \RuntimeException
    {
        return new \RuntimeException("Repository `{$varName}` variable is not set");
    }

    protected function mapToEntity(string $entityClass, array $row): BaseEntity
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
            $valueExists = $dbValue !== null;
            $type = $param->getType();

            // Handle #[ArrayOf]
            $arrayOf = $param->getAttributes(ArrayOf::class)[0] ?? null;
            if ($arrayOf !== null) {
                $itemType = $arrayOf->newInstance()->type;
                $items = $valueExists
                    ? array_map('trim', explode(',', (string) $dbValue))
                    : [];

                $arguments[] = array_map(
                    static fn (string $item) => new $itemType($item),
                    $items
                );

                continue;
            }

            // Value Object
            if (
                $valueExists
                && $type instanceof \ReflectionNamedType
                && !$type->isBuiltin()
            ) {
                $className = $type->getName();
                $arguments[] = new $className($dbValue);
                continue;
            }

            $arguments[] = $dbValue;
        }

        return $reflection->newInstanceArgs($arguments);
    }

    protected function query(string $sql, array $params = []): \PDOStatement
    {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    protected function fetchOne(string $entityClass, string $sql, array $params = []): ?BaseEntity
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

        $updatableFields = static::UPDATABLE_FIELDS;
        $keys = array_keys($entityFields);

        foreach ($keys as $field) {
            if (!\in_array($field, $updatableFields, true)) {
                throw new \InvalidArgumentException("Field '{$field}' is not allowed for updates in {$tableName}");
            }
        }

        $setClauses = implode(', ', array_map(
            static fn (string $field) => "{$field} = ?",
            $keys
        ));

        // Execute the query
        $sql = 'UPDATE ' . $tableName . " SET {$setClauses} WHERE id = ?";
        $this->query($sql, [...array_values($entityFields), $entityId]);
    }
}
