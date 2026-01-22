-- Add refresh_token column to users table
ALTER TABLE users 
ADD COLUMN refresh_token VARCHAR(255) NULL AFTER password;

-- Add index for faster lookups
CREATE INDEX idx_refresh_token ON users(refresh_token);
