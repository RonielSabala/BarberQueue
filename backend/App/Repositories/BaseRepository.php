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
    protected const array UPDATABLE_FIELDS = [];

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

    public function transaction(callable $callback): mixed
    {
        if (!$this->db->beginTransaction()) {
            throw new \RuntimeException('Could not start transaction');
        }

        try {
            $result = $callback();
            $this->db->commit();
            return $result;
        } catch (\Throwable $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }

            throw $e;
        }
    }

    public function updateFrom(string $tableName, array $entityFields, array $params): void
    {
        if (empty($entityFields)) {
            return;
        }

        $updatableFields = static::UPDATABLE_FIELDS;
        $fields = array_keys($entityFields);

        foreach ($fields as $field) {
            if (!\in_array($field, $updatableFields, true)) {
                throw new \InvalidArgumentException(
                    "Field '{$field}' is not allowed for updates in {$tableName}"
                );
            }
        }

        $setClauses = implode(', ', array_map(
            static fn (string $field) => "{$field} = ?",
            $fields
        ));

        $whereClauses = implode(' AND ', array_map(
            static fn (string $param) => "{$param} = ?",
            array_keys($params)
        ));

        $sql = "UPDATE {$tableName} SET {$setClauses} WHERE {$whereClauses}";
        $this->query($sql, [...array_values($entityFields), ...array_values($params)]);
    }

    public function deleteFrom(string $tableName, array $params): bool
    {
        $whereClauses = implode(' AND ', array_map(
            static fn (string $param) => "{$param} = ?",
            array_keys($params)
        ));

        $sql = "DELETE FROM {$tableName} WHERE {$whereClauses}";
        $stmt = $this->query($sql, array_values($params));
        return $stmt->rowCount() > 0;
    }

    public function update(int $entityId, array $entityFields, array $params = []): void
    {
        $tableName = static::TABLE_NAME;
        if ($tableName === null) {
            throw $this->missingVariablesException('TABLE_NAME');
        }

        $this->updateFrom($tableName, $entityFields, ['id' => $entityId, ...$params]);
    }

    public function delete(int $entityId, array $params = []): bool
    {
        $tableName = static::TABLE_NAME;
        if ($tableName === null) {
            throw $this->missingVariablesException('TABLE_NAME');
        }

        return $this->deleteFrom($tableName, ['id' => $entityId, ...$params]);
    }
}
