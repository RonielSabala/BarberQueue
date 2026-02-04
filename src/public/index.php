<?php
const BASE_DIR = __DIR__ . '/../';
require_once BASE_DIR . 'vendor/autoload.php';
require_once BASE_DIR . 'config/db.php';

use App\Core\Router;
use App\Controllers;

// Create PDO singleton
try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8",
        $user,
        $pass
    );
} catch (PDOException $e) {
    die("Error de BD: " . $e->getMessage());
}

// Controllers and routes
const _DEFAULT_VIEW_NAME = 'home';
const _DEFAULT_VIEW_ROUTE = ['view' => _DEFAULT_VIEW_NAME, 'controller' => Controllers\HomeController::class];
const _ROUTES = [
    // Default home route
    ''          => _DEFAULT_VIEW_ROUTE,
    'home.php'  => _DEFAULT_VIEW_ROUTE,
    'index.php' => _DEFAULT_VIEW_ROUTE,
];

# Create Router singleton
const _ROUTER = new Router();
_ROUTER->dispatch();
