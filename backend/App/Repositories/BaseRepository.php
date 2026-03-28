<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Config\DbConfig;
use App\Domain\Entities\BaseEntity;

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

    protected function query(string $sql, array $params = []): \PDOStatement
    {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    /** @param class-string<BaseEntity> $entityClass */
    protected function fetchOne(string $entityClass, string $sql, array $params = []): ?BaseEntity
    {
        $stmt = $this->query($sql, $params);
        $row = $stmt->fetch();
        return $row ? $entityClass::fromDbRow($row) : null;
    }

    /** @param class-string<BaseEntity> $entityClass */
    protected function fetchAll(string $entityClass, string $sql, array $params = []): array
    {
        $stmt = $this->query($sql, $params);
        $results = [];

        while ($row = $stmt->fetch()) {
            $results[] = $entityClass::fromDbRow($row);
        }

        return $results;
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

    public function insert(array $entityFields): int
    {
        $tableName = static::TABLE_NAME;
        if ($tableName === null) {
            throw $this->missingVariablesException('TABLE_NAME');
        }

        if (empty($entityFields)) {
            throw new \InvalidArgumentException("Cannot insert an empty field set into {$tableName}");
        }

        $columns = implode(', ', array_keys($entityFields));
        $placeholders = implode(', ', array_fill(0, \count($entityFields), '?'));

        $sql = "INSERT INTO {$tableName} ({$columns}) VALUES ({$placeholders})";

        $this->query($sql, array_values($entityFields));
        return (int) $this->db->lastInsertId();
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
