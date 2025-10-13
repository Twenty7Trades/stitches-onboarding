#!/bin/bash

# AWS Deployment Script for Stitches Onboarding
# This script automates the entire AWS deployment process

set -e

echo "🚀 Starting AWS deployment for Stitches Onboarding..."

# Configuration
APP_NAME="stitches-onboarding"
DB_INSTANCE_ID="stitches-onboarding-db"
DB_USERNAME="stitches_admin"
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
REGION="us-east-1"

echo "📋 Configuration:"
echo "  App Name: $APP_NAME"
echo "  Database: $DB_INSTANCE_ID"
echo "  Region: $REGION"
echo "  DB Password: [GENERATED]"

# Step 1: Create RDS PostgreSQL Database
echo "🗄️  Creating RDS PostgreSQL database..."
aws rds create-db-instance \
    --db-instance-identifier $DB_INSTANCE_ID \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username $DB_USERNAME \
    --master-user-password $DB_PASSWORD \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-05bac9d0c7e01be0b \
    --db-name postgres \
    --publicly-accessible \
    --region $REGION \
    --tags Key=Project,Value=StitchesOnboarding Key=Environment,Value=Production

echo "⏳ Waiting for database to be available (this may take 10-15 minutes)..."
aws rds wait db-instance-available \
    --db-instance-identifier $DB_INSTANCE_ID \
    --region $REGION

# Get database endpoint
DB_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier $DB_INSTANCE_ID \
    --region $REGION \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text)

echo "✅ Database created successfully!"
echo "  Endpoint: $DB_ENDPOINT"
echo "  Username: $DB_USERNAME"
echo "  Password: $DB_PASSWORD"

# Step 2: Create Security Group for Database
echo "🔒 Creating security group for database access..."
SECURITY_GROUP_ID=$(aws ec2 create-security-group \
    --group-name stitches-db-sg \
    --description "Security group for Stitches Onboarding database" \
    --region $REGION \
    --query 'GroupId' \
    --output text)

# Allow PostgreSQL access from anywhere (for Amplify)
aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 5432 \
    --cidr 0.0.0.0/0 \
    --region $REGION

echo "✅ Security group created: $SECURITY_GROUP_ID"

# Step 3: Create Amplify App
echo "🌐 Creating AWS Amplify app..."
AMPLIFY_APP_ID=$(aws amplify create-app \
    --name $APP_NAME \
    --description "Customer onboarding form for Stitches Clothing Co" \
    --repository "https://github.com/Twenty7Trades/stitches-onboarding" \
    --platform WEB \
    --region $REGION \
    --query 'app.appId' \
    --output text)

echo "✅ Amplify app created: $AMPLIFY_APP_ID"

# Step 4: Create Branch
echo "🌿 Creating main branch..."
aws amplify create-branch \
    --app-id $AMPLIFY_APP_ID \
    --branch-name main \
    --description "Main production branch" \
    --region $REGION

# Step 5: Generate Environment Variables
echo "🔑 Generating secure keys..."
NEXTAUTH_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)
DATABASE_URL="postgresql://$DB_USERNAME:$DB_PASSWORD@$DB_ENDPOINT:5432/postgres"

# Step 6: Set Environment Variables
echo "⚙️  Setting environment variables..."
aws amplify put-backend-environment \
    --app-id $AMPLIFY_APP_ID \
    --environment-name main \
    --region $REGION

# Create environment variables file for Amplify
cat > amplify-env-vars.json << EOF
{
    "NEXTAUTH_SECRET": "$NEXTAUTH_SECRET",
    "ENCRYPTION_KEY": "$ENCRYPTION_KEY",
    "DATABASE_URL": "$DATABASE_URL",
    "NEXTAUTH_URL": "https://main.$AMPLIFY_APP_ID.amplifyapp.com"
}
EOF

echo "📝 Environment variables saved to amplify-env-vars.json"

# Step 7: Start Deployment
echo "🚀 Starting deployment..."
aws amplify start-job \
    --app-id $AMPLIFY_APP_ID \
    --branch-name main \
    --job-type RELEASE \
    --region $REGION

echo "✅ Deployment started!"

# Step 8: Create database initialization script
echo "📊 Creating database initialization script..."
cat > init-database.sql << EOF
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
INSERT INTO admin_users (email, password_hash, name) VALUES (
    'sales@pixelprint.la',
    '\$2b\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Admin User'
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS \$\$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
\$\$ language 'plpgsql';

-- Create trigger for customers table
CREATE TRIGGER update_customers_updated_at 
    BEFORE UPDATE ON customers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
EOF

echo "📋 Summary:"
echo "  Amplify App ID: $AMPLIFY_APP_ID"
echo "  App URL: https://main.$AMPLIFY_APP_ID.amplifyapp.com"
echo "  Database Endpoint: $DB_ENDPOINT"
echo "  Database Username: $DB_USERNAME"
echo "  Database Password: $DB_PASSWORD"
echo ""
echo "📝 Next Steps:"
echo "  1. Run the SQL script (init-database.sql) on your database"
echo "  2. Set environment variables in Amplify console"
echo "  3. Wait for deployment to complete"
echo "  4. Test your application!"
echo ""
echo "🔗 Useful Links:"
echo "  Amplify Console: https://console.aws.amazon.com/amplify/home?region=$REGION#/$AMPLIFY_APP_ID"
echo "  RDS Console: https://console.aws.amazon.com/rds/home?region=$REGION#database:id=$DB_INSTANCE_ID"
echo ""
echo "✅ AWS deployment setup complete!"
