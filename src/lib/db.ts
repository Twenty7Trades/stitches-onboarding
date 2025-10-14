import Database from 'better-sqlite3';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

// Determine if we're in production (PostgreSQL) or development (SQLite)
const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.startsWith('postgresql://');
const isBuildTime = process.env.BUILD_TIME === 'true';

let db: Database.Database | null = null;
let pgPool: Pool | null = null;

// Lazy initialization - only connect at runtime, not during build
function getDatabase() {
  if (isProduction && !isBuildTime) {
    if (!pgPool) {
      pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
    }
    return pgPool;
  } else if (!isProduction && !isBuildTime) {
    if (!db) {
      db = new Database('stitches.db');
    }
    return db;
  }
  return null;
}

// Initialize database connections only at runtime
if (!isBuildTime) {
  if (isProduction) {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  } else {
    db = new Database('stitches.db');
  }
}

// Initialize database tables
export async function initializeDatabase() {
  const database = getDatabase();
  
  if (isProduction && database) {
    // PostgreSQL initialization
    const client = await database.connect();
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
    } finally {
      client.release();
    }
  } else if (database) {
    // SQLite initialization
    database.exec(`
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

    database.exec(`
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
    database.exec(`
      CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(main_email);
      CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
      CREATE INDEX IF NOT EXISTS idx_customers_submission_date ON customers(submission_date DESC);
    `);
  }
}

// Customer operations
export const customerQueries = {
  insert: async (data: (string | number)[]) => {
    const database = getDatabase();
    if (isProduction && database) {
      const client = await database.connect();
      try {
        const result = await client.query(`
          INSERT INTO customers (
            id, business_name, main_email, main_contact_rep, phone, asi_number,
            business_type, years_in_business, ein_number_encrypted, estimated_annual_business,
            average_order_size, billing_address, billing_city, billing_state, billing_zip,
            billing_contact, billing_phone, billing_email, shipping_address, shipping_city,
            shipping_state, shipping_zip, shipping_contact, shipping_phone, payment_method,
            payment_card_last4, payment_card_type, payment_account_last4, payment_account_type,
            payment_authorizations_encrypted, signature_data, status, submission_date, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35)
        `, data);
        return result;
      } finally {
        client.release();
      }
    } else if (database) {
      return database.prepare(`
        INSERT INTO customers (
          id, business_name, main_email, main_contact_rep, phone, asi_number,
          business_type, years_in_business, ein_number_encrypted, estimated_annual_business,
          average_order_size, billing_address, billing_city, billing_state, billing_zip,
          billing_contact, billing_phone, billing_email, shipping_address, shipping_city,
          shipping_state, shipping_zip, shipping_contact, shipping_phone, payment_method,
          payment_card_last4, payment_card_type, payment_account_last4, payment_account_type,
          payment_authorizations_encrypted, signature_data, status, submission_date, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(...data);
    }
  },

  getAll: async () => {
    const database = getDatabase();
    if (isProduction && database) {
      const client = await database.connect();
      try {
        const result = await client.query(`
          SELECT * FROM customers ORDER BY submission_date DESC
        `);
        return result.rows;
      } finally {
        client.release();
      }
    } else if (database) {
      return database.prepare(`
        SELECT * FROM customers ORDER BY submission_date DESC
      `).all();
    }
    return [];
  },

  getById: async (id: string) => {
    const database = getDatabase();
    if (isProduction && database) {
      const client = await database.connect();
      try {
        const result = await client.query(`
          SELECT * FROM customers WHERE id = $1
        `, [id]);
        return result.rows[0] || null;
      } finally {
        client.release();
      }
    } else if (database) {
      return database.prepare(`
        SELECT * FROM customers WHERE id = ?
      `).get(id);
    }
    return null;
  },

  updateStatus: async (status: string, id: string) => {
    const database = getDatabase();
    if (isProduction && database) {
      const client = await database.connect();
      try {
        const result = await client.query(`
          UPDATE customers SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2
        `, [status, id]);
        return result;
      } finally {
        client.release();
      }
    } else if (database) {
      return database.prepare(`
        UPDATE customers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).run(status, id);
    }
  }
};

// Admin user operations
export const adminQueries = {
  insert: async (id: string, email: string, passwordHash: string, name: string) => {
    const database = getDatabase();
    if (isProduction && database) {
      const client = await database.connect();
      try {
        const result = await client.query(`
          INSERT INTO admin_users (id, email, password_hash, name) VALUES ($1, $2, $3, $4)
        `, [id, email, passwordHash, name]);
        return result;
      } finally {
        client.release();
      }
    } else if (database) {
      return database.prepare(`
        INSERT INTO admin_users (id, email, password_hash, name) VALUES (?, ?, ?, ?)
      `).run(id, email, passwordHash, name);
    }
  },

  getByEmail: async (email: string) => {
    const database = getDatabase();
    if (isProduction && database) {
      const client = await database.connect();
      try {
        const result = await client.query(`
          SELECT * FROM admin_users WHERE email = $1
        `, [email]);
        return result.rows[0] || null;
      } finally {
        client.release();
      }
    } else if (database) {
      return database.prepare(`
        SELECT * FROM admin_users WHERE email = ?
      `).get(email);
    }
    return null;
  },

  updateLastLogin: async (id: string) => {
    const database = getDatabase();
    if (isProduction && database) {
      const client = await database.connect();
      try {
        const result = await client.query(`
          UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1
        `, [id]);
        return result;
      } finally {
        client.release();
      }
    } else if (database) {
      return database.prepare(`
        UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?
      `).run(id);
    }
  }
};

// Utility function to generate UUID
export { uuidv4 };