import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';

const db = new Database('stitches.db');

// Initialize database tables
export function initializeDatabase() {
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
}

// Customer operations
export const customerQueries = {
  insert: (data: (string | number)[]) => {
    return db.prepare(`
      INSERT INTO customers (
        id, business_name, main_email, main_contact_rep, phone, asi_number,
        business_type, years_in_business, ein_number_encrypted, estimated_annual_business,
        average_order_size, billing_address, billing_city, billing_state, billing_zip,
        billing_contact, billing_phone, billing_email, shipping_address, shipping_city,
        shipping_state, shipping_zip, shipping_contact, shipping_phone, payment_method,
        payment_card_last4, payment_card_type, payment_account_last4, payment_account_type,
        payment_authorizations_encrypted, signature_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(...data);
  },

  getAll: () => {
    return db.prepare(`
      SELECT * FROM customers ORDER BY submission_date DESC
    `).all();
  },

  getById: (id: string) => {
    return db.prepare(`
      SELECT * FROM customers WHERE id = ?
    `).get(id);
  },

  updateStatus: (status: string, id: string) => {
    return db.prepare(`
      UPDATE customers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(status, id);
  }
};

// Admin user operations
export const adminQueries = {
  insert: (id: string, email: string, passwordHash: string, name: string) => {
    return db.prepare(`
      INSERT INTO admin_users (id, email, password_hash, name) VALUES (?, ?, ?, ?)
    `).run(id, email, passwordHash, name);
  },

  getByEmail: (email: string) => {
    return db.prepare(`
      SELECT * FROM admin_users WHERE email = ?
    `).get(email);
  },

  updateLastLogin: (id: string) => {
    return db.prepare(`
      UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?
    `).run(id);
  }
};

// Initialize database on import
try {
  initializeDatabase();
} catch (error) {
  console.error('Database initialization error:', error);
}

export { db };
export { uuidv4 };
