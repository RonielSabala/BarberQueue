<?php

declare(strict_types=1);

require_once __DIR__ . '/../backend/bootstrap.php';

use App\Config\DbConfig;
use Scripts\Utils\{DatabaseInstaller, OutputUtils};

const DB_DIR = ROOT_DIR . '/database';

DbConfig::init(withDatabase: false);

try {
    $installer = new DatabaseInstaller(DbConfig::getConnection());
    $installer->run(DbConfig::getDbName(), [
        DB_DIR . '/creation.sql',
        DB_DIR . '/insertions.sql',
    ]);

    echo OutputUtils::success('Database installed successfully!');
} catch (\PDOException $e) {
    echo OutputUtils::error('Database error: ' . $e->getMessage());
} catch (\RuntimeException $e) {
    echo OutputUtils::error($e->getMessage());
}
