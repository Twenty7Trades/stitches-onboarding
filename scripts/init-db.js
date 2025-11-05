const Database = require('better-sqlite3');

const db = new Database('stitches.db');

// Initialize database tables
function initializeDatabase() {
  // Create customers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      business_name TEXT NOT NULL,
      main_email TEXT NOT NULL,
      main_contact_rep TEXT,
      phone TEXT,
      asi_number TEXT,
      business_type TEXT,
      years_in_business INTEGER,
      ein_number_encrypted TEXT,
      estimated_annual_business REAL,
      average_order_size INTEGER,
      billing_address TEXT,
      billing_city TEXT,
      billing_state TEXT,
      billing_zip TEXT,
      billing_contact TEXT,
      billing_phone TEXT,
      billing_email TEXT,
      shipping_address TEXT,
      shipping_city TEXT,
      shipping_state TEXT,
      shipping_zip TEXT,
      shipping_contact TEXT,
      shipping_phone TEXT,
      payment_method TEXT,
      payment_card_last4 TEXT,
      payment_card_type TEXT,
      payment_account_last4 TEXT,
      payment_account_type TEXT,
      payment_authorizations_encrypted TEXT,
      signature_data TEXT,
      status TEXT DEFAULT 'pending',
      submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create admin_users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(main_email);
    CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
    CREATE INDEX IF NOT EXISTS idx_customers_submission_date ON customers(submission_date DESC);
  `);

  console.log('Database initialized successfully!');
  console.log('Tables created: customers, admin_users');
}

initializeDatabase();
db.close();

