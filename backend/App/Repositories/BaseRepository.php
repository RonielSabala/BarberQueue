<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Config\DbConfig;
use App\Utils\TextUtils;

abstract class BaseRepository
{
    protected \PDO $db;

    public function __construct()
    {
        $this->db = DbConfig::getConnection();
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
}
