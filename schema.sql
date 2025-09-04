-- Xoá DB cũ nếu có (chỉ chạy local, trên Railway thì để nguyên)
-- DROP DATABASE IF EXISTS smartdesk;
-- CREATE DATABASE smartdesk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE smartdesk;

-- Nếu dùng Railway thì chỉ cần USE:
USE railway;

-- ========================
-- Bảng lưu thông tin thiết bị
-- ========================
CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_uid VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    token VARCHAR(64) NOT NULL,
    last_seen TIMESTAMP NULL DEFAULT NULL
);

-- ========================
-- Bảng lưu dữ liệu cảm biến
-- ========================
CREATE TABLE IF NOT EXISTS readings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    temperature FLOAT,
    humidity FLOAT,
    light INT,
    noise INT,
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);
