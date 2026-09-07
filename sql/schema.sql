-- Chiflloy contact form — messages table
-- Run this inside your database in phpMyAdmin (SQL tab).
-- Most hosts pre-create the database for you, so this only creates the table.

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
