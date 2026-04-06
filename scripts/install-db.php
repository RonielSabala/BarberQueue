<?php

declare(strict_types=1);

require_once __DIR__ . '/../backend/bootstrap.php';

use App\Config\DbConfig;
use Scripts\Utils\{DatabaseInstaller, OutputUtils};

const DB_DIR = ROOT_DIR . '/database';
const DB_CREATION_PATH = DB_DIR . '/creation.sql';
const DB_TRIGGERS_PATH = DB_DIR . '/triggers.sql';

DbConfig::init(withDatabase: false);

try {
    $dbName = DbConfig::getDbName();
    $installer = new DatabaseInstaller(DbConfig::getConnection());

    // Production db
    $installer->run($dbName, [
        DB_CREATION_PATH,
        DB_TRIGGERS_PATH,
        DB_DIR . '/insertions.sql',
    ]);

    // Tests db
    $installer->run($dbName . '_tests', [
        DB_CREATION_PATH,
        DB_TRIGGERS_PATH,
        DB_DIR . '/tests/insertions.sql',
    ]);

    echo OutputUtils::success('Databases installed successfully!');
} catch (\PDOException $e) {
    echo OutputUtils::error('Database error: ' . $e->getMessage());
} catch (\Throwable $e) {
    echo OutputUtils::error($e->getMessage());
}
