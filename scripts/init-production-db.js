const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://stitches_admin:Stitches123456@stitches-onboarding-db.c670wmesu7vt.us-east-1.rds.amazonaws.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function initializeDatabase() {
  try {
    console.log('Connecting to PostgreSQL database...');
    await client.connect();
    console.log('Connected successfully!');

    // Create customers table
    console.log('Creating customers table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        business_name VARCHAR(255) NOT NULL,
        main_email VARCHAR(255) NOT NULL,
        main_contact_rep VARCHAR(255),
        phone VARCHAR(20),
        asi_number VARCHAR(50),
        business_type VARCHAR(50),
        years_in_business INTEGER,
        ein_number_encrypted TEXT,
        estimated_annual_business VARCHAR(50),
        average_order_size VARCHAR(50),
        billing_address VARCHAR(255),
        billing_city VARCHAR(100),
        billing_state VARCHAR(50),
        billing_zip VARCHAR(10),
        billing_contact VARCHAR(255),
        billing_phone VARCHAR(20),
        billing_email VARCHAR(255),
        shipping_address VARCHAR(255),
        shipping_city VARCHAR(100),
        shipping_state VARCHAR(50),
        shipping_zip VARCHAR(10),
        shipping_contact VARCHAR(255),
        shipping_phone VARCHAR(20),
        payment_method VARCHAR(50),
        payment_card_last4 VARCHAR(4),
        payment_card_type VARCHAR(50),
        payment_account_last4 VARCHAR(4),
        payment_account_type VARCHAR(50),
        payment_authorizations_encrypted TEXT,
        signature_data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admin_users table
    console.log('Creating admin_users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create initial admin user
    console.log('Creating initial admin user...');
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('Stitches123', 10);
    
    await client.query(`
      INSERT INTO admin_users (email, password_hash) 
      VALUES ($1, $2) 
      ON CONFLICT (email) DO NOTHING
    `, ['sales@pixelprint.la', hashedPassword]);

    console.log('✅ Database initialization completed successfully!');
    console.log('Admin credentials: sales@pixelprint.la / Stitches123');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await client.end();
  }
}

initializeDatabase();
