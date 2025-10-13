-- Create database tables for Stitches Onboarding
-- Run this script on your PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(255) NOT NULL,
    main_email VARCHAR(255) NOT NULL,
    main_contact_rep VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    asi_number VARCHAR(50),
    business_type VARCHAR(50) NOT NULL,
    years_in_business INTEGER,
    ein_number_encrypted TEXT,
    estimated_annual_business DECIMAL(15,2),
    average_order_size INTEGER,
    billing_address TEXT,
    billing_city VARCHAR(100),
    billing_state VARCHAR(50),
    billing_zip VARCHAR(20),
    billing_contact VARCHAR(255),
    billing_phone VARCHAR(20),
    billing_email VARCHAR(255),
    shipping_address TEXT,
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(50),
    shipping_zip VARCHAR(20),
    shipping_contact VARCHAR(255),
    shipping_phone VARCHAR(20),
    payment_method VARCHAR(20) NOT NULL,
    payment_card_last4 VARCHAR(4),
    payment_card_type VARCHAR(20),
    payment_account_last4 VARCHAR(4),
    payment_account_type VARCHAR(20),
    payment_authorizations_encrypted TEXT,
    signature_data TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_customers_email ON customers(main_email);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_submission_date ON customers(submission_date);
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Insert initial admin user (password: Stitches123)
-- Note: This password hash is for 'Stitches123' - change in production!
INSERT INTO admin_users (email, password_hash, name) VALUES (
    'sales@pixelprint.la',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Admin User'
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for customers table
CREATE TRIGGER update_customers_updated_at 
    BEFORE UPDATE ON customers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
