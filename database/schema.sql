-- Create the database
CREATE DATABASE IF NOT EXISTS resradio;
USE resradio;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Broadcasts table
CREATE TABLE IF NOT EXISTS broadcasts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    hosted_by VARCHAR(255) NOT NULL,
    prismic_id VARCHAR(255),
    begin_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_prismic_id (prismic_id),
    INDEX idx_begin_time (begin_time),
    INDEX idx_end_time (end_time)
);

-- Playbacks table
CREATE TABLE IF NOT EXISTS playbacks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    reference_text VARCHAR(255),
    show_prismic_id VARCHAR(255),
    prismic_id VARCHAR(255),
    playback_date DATETIME NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_show_prismic_id (show_prismic_id),
    INDEX idx_prismic_id (prismic_id),
    INDEX idx_playback_date (playback_date)
);
