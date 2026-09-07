<?php
/**
 * Database connection for the Chiflloy contact form.
 *
 * Fill these in with your own host's values (from your hosting control
 * panel / phpMyAdmin) before deploying. Most hosts pre-create the database
 * for you and only grant your DB user access to that one database — so
 * this connects directly to DB_NAME rather than trying to create it.
 *
 * Run sql/schema.sql (via phpMyAdmin) once to create the `messages` table;
 * this file also creates it automatically on first request as a fallback.
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'chiflloy_portfolio');
define('DB_USER', 'root');
define('DB_PASS', '');

function get_db(): PDO {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(120) NOT NULL,
            email VARCHAR(190) NOT NULL,
            message TEXT NOT NULL,
            is_read TINYINT(1) NOT NULL DEFAULT 0,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            ip_address VARCHAR(45) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    return $pdo;
}
