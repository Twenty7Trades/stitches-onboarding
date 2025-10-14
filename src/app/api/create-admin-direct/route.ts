import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    console.log('Creating admin user with direct database connection...');
    
    // Direct database connection
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    const client = await pool.connect();
    try {
      // Check if user exists
      const existingUser = await client.query(
        'SELECT id FROM admin_users WHERE email = $1',
        ['sales@pixelprint.la']
      );
      
      if (existingUser.rows.length > 0) {
        console.log('User already exists, deleting...');
        await client.query('DELETE FROM admin_users WHERE email = $1', ['sales@pixelprint.la']);
      }
      
      // Create new user
      const userId = crypto.randomUUID();
      const email = 'sales@pixelprint.la';
      const password = 'Stitches123';
      const name = 'Admin User';
      
      console.log('Hashing password...');
      const passwordHash = await bcrypt.hash(password, 12);
      console.log('Password hashed:', passwordHash.substring(0, 20) + '...');
      
      console.log('Inserting user...');
      await client.query(
        'INSERT INTO admin_users (id, email, password_hash, name) VALUES ($1, $2, $3, $4)',
        [userId, email, passwordHash, name]
      );
      
      console.log('User inserted successfully');
      
      // Verify the user was created
      const verifyUser = await client.query(
        'SELECT id, email, name FROM admin_users WHERE email = $1',
        [email]
      );
      
      console.log('Verification result:', verifyUser.rows.length > 0 ? 'User found' : 'User not found');
      
      return NextResponse.json({
        success: true,
        message: 'Admin user created successfully with direct connection',
        user: verifyUser.rows[0] || null
      });
      
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Direct admin user creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create admin user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
