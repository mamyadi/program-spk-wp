-- Create the database
CREATE DATABASE IF NOT EXISTS spk_wp;
USE spk_wp;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the criteria table
CREATE TABLE IF NOT EXISTS criteria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  name VARCHAR(100) NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  type ENUM('benefit', 'cost') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the alternatives table
CREATE TABLE IF NOT EXISTS alternatives (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the scores table for storing alternative scores against criteria
CREATE TABLE IF NOT EXISTS scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alternative_id INT NOT NULL,
  criteria_id INT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (alternative_id) REFERENCES alternatives(id) ON DELETE CASCADE,
  FOREIGN KEY (criteria_id) REFERENCES criteria(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password) VALUES ('admin', '$2b$10$1JU5iXJvVBrM.LSv0/NQueYVGPPvJWWTAK/dPTnKabSK1XsxQX5a.');

-- Insert sample criteria
INSERT INTO criteria (code, name, weight, type) VALUES 
('C1', 'Price', 0.30, 'cost'),
('C2', 'Quality', 0.25, 'benefit'),
('C3', 'Features', 0.20, 'benefit'),
('C4', 'Durability', 0.15, 'benefit'),
('C5', 'Warranty', 0.10, 'benefit');

-- Insert sample alternatives
INSERT INTO alternatives (code, name) VALUES 
('A1', 'Product 1'),
('A2', 'Product 2'),
('A3', 'Product 3'),
('A4', 'Product 4'),
('A5', 'Product 5');

-- Insert sample scores
-- Alternative 1 scores
INSERT INTO scores (alternative_id, criteria_id, value) VALUES
(1, 1, 450), (1, 2, 8), (1, 3, 9), (1, 4, 7), (1, 5, 5);

-- Alternative 2 scores
INSERT INTO scores (alternative_id, criteria_id, value) VALUES
(2, 1, 500), (2, 2, 9), (2, 3, 7), (2, 4, 8), (2, 5, 7);

-- Alternative 3 scores
INSERT INTO scores (alternative_id, criteria_id, value) VALUES
(3, 1, 400), (3, 2, 7), (3, 3, 8), (3, 4, 6), (3, 5, 6);

-- Alternative 4 scores
INSERT INTO scores (alternative_id, criteria_id, value) VALUES
(4, 1, 550), (4, 2, 9), (4, 3, 9), (4, 4, 9), (4, 5, 8);

-- Alternative 5 scores
INSERT INTO scores (alternative_id, criteria_id, value) VALUES
(5, 1, 350), (5, 2, 6), (5, 3, 6), (5, 4, 5), (5, 5, 4);
