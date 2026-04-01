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

    // Helpers

    private function getTableName(): string
    {
        $tableName = static::TABLE_NAME;
        if ($tableName === null) {
            throw new \RuntimeException('Repository `TABLE_NAME` variable is not set');
        }

        return $tableName;
    }

    private function getClauses(string $clauseToken, array $columns): string
    {
        return implode($clauseToken, array_map(
            static fn (string $column) => "{$column} = ?",
            $columns
        ));
    }

    private function getSetClauses(array $fields): string
    {
        return $this->getClauses(', ', $fields);
    }

    private function getWhereClauses(array $params): string
    {
        return $this->getClauses(' AND ', array_keys($params));
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

    // Query methods

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

    /**
     * @param class-string<BaseEntity> $entityClass
     *
     * @return BaseEntity[]
     */
    protected function fetchAll(string $entityClass, string $sql, array $params = []): array
    {
        $stmt = $this->query($sql, $params);
        $results = [];

        while ($row = $stmt->fetch()) {
            $results[] = $entityClass::fromDbRow($row);
        }

        return $results;
    }

    // General CRUD methods

    public function entityExists(string $tableName, array $params): bool
    {
        if (empty($params)) {
            return false;
        }

        $sql = <<<SQL
            SELECT
                1
            FROM
                {$tableName}
            WHERE
                {$this->getWhereClauses($params)}
            LIMIT
                1
        SQL;

        $stmt = $this->query($sql, array_values($params));
        return $stmt->fetchColumn() !== false;
    }

    public function insert(array $entityFields): int
    {
        $tableName = $this->getTableName();
        if (empty($entityFields)) {
            throw new \InvalidArgumentException("Cannot insert an empty field set into {$tableName}");
        }

        $columns = implode(', ', array_keys($entityFields));
        $placeholders = implode(', ', array_fill(0, \count($entityFields), '?'));
        $sql = <<<SQL
            INSERT INTO
                {$tableName} ({$columns})
            VALUES
                ({$placeholders})
        SQL;

        $this->query($sql, array_values($entityFields));
        return (int) $this->db->lastInsertId();
    }

    public function updateFrom(string $tableName, array $entityFields, array $params): void
    {
        if (empty($entityFields) || empty($params)) {
            return;
        }

        $fields = array_keys($entityFields);
        $updatableFields = static::UPDATABLE_FIELDS;

        foreach ($fields as $field) {
            if (!\in_array($field, $updatableFields, true)) {
                throw new \InvalidArgumentException(
                    "Field '{$field}' is not allowed for updates in {$tableName}"
                );
            }
        }

        $sql = <<<SQL
            UPDATE {$tableName}
            SET
                {$this->getSetClauses($fields)}
            WHERE
                {$this->getWhereClauses($params)}
        SQL;

        $this->query($sql, [...array_values($entityFields), ...array_values($params)]);
    }

    public function deleteFrom(string $tableName, array $params): bool
    {
        if (empty($params)) {
            return false;
        }

        $sql = <<<SQL
            DELETE FROM {$tableName}
            WHERE
                {$this->getWhereClauses($params)}
        SQL;

        $stmt = $this->query($sql, array_values($params));
        return $stmt->rowCount() > 0;
    }

    // Entity specific CRUD methods

    public function exists(int $entityId, array $params = []): bool
    {
        return $this->entityExists(
            $this->getTableName(),
            ['id' => $entityId, ...$params]
        );
    }

    public function update(int $entityId, array $entityFields, array $params = []): void
    {
        $this->updateFrom(
            $this->getTableName(),
            $entityFields,
            ['id' => $entityId, ...$params]
        );
    }

    public function delete(int $entityId, array $params = []): bool
    {
        return $this->deleteFrom(
            $this->getTableName(),
            ['id' => $entityId, ...$params]
        );
    }
}
