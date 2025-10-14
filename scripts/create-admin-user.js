const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const db = new Database('stitches.db');

async function createAdminUser() {
  const adminId = uuidv4();
  const email = 'sales@pixelprint.la';
  const password = 'Stitches123';
  const name = 'Admin User';
  
  // Hash the password
  const passwordHash = await bcrypt.hash(password, 12);
  
  // Insert admin user
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO admin_users (id, email, password_hash, name)
    VALUES (?, ?, ?, ?)
  `);
  
  stmt.run(adminId, email, passwordHash, name);
  
  console.log('Admin user created successfully!');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

createAdminUser().then(() => {
  db.close();
}).catch(console.error);
