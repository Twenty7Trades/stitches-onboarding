const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Database = require('better-sqlite3');

// Initialize database
const db = new Database('stitches.db');

// Create admin_users table if it doesn't exist
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

// Admin user operations
const adminQueries = {
  insert: db.prepare(`
    INSERT INTO admin_users (id, email, password_hash, name) VALUES (?, ?, ?, ?)
  `),
  getByEmail: db.prepare(`
    SELECT * FROM admin_users WHERE email = ?
  `)
};

async function setupAdmin() {
  try {
    const email = 'sales@pixelprint.la';
    const password = 'Stitches123';
    const name = 'Admin User';

    // Check if admin already exists
    const existingAdmin = adminQueries.getByEmail.get(email);
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create admin user
    const adminId = uuidv4();
    adminQueries.insert.run(adminId, email, passwordHash, name);

    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Please change the password after first login for security.');

  } catch (error) {
    console.error('Error setting up admin user:', error);
  }
}

setupAdmin();
