const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initializeProductionDatabase() {
  const client = await pool.connect();
  
  try {
    // Create customers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(36) PRIMARY KEY,
        business_name VARCHAR(255) NOT NULL,
        main_email VARCHAR(255) NOT NULL,
        main_contact_rep VARCHAR(255),
        phone VARCHAR(20),
        asi_number VARCHAR(50),
        business_type VARCHAR(50),
        years_in_business INTEGER,
        ein_number_encrypted TEXT,
        estimated_annual_business DECIMAL(10,2),
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
        payment_method VARCHAR(20),
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
      )
    `);

    // Create admin_users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(main_email);
      CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
      CREATE INDEX IF NOT EXISTS idx_customers_submission_date ON customers(submission_date DESC);
    `);

    console.log('Production database initialized successfully!');
    console.log('Tables created: customers, admin_users');

    // Create admin user
    const adminId = uuidv4();
    const email = 'sales@pixelprint.la';
    const password = 'Stitches123';
    const name = 'Admin User';
    
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Insert admin user
    await client.query(`
      INSERT INTO admin_users (id, email, password_hash, name)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        name = EXCLUDED.name
    `, [adminId, email, passwordHash, name]);
    
    console.log('Admin user created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

  } finally {
    client.release();
  }
}

initializeProductionDatabase()
  .then(() => {
    console.log('Database initialization complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });