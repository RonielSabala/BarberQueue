<?php
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

// Database connection details
$host = $_ENV['HOST'];
$user = $_ENV['USER'];
$pass = $_ENV['PASS'];
$db = "barber_queue_db";
