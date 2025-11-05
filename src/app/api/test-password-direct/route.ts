import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    console.log('Testing direct password verification...');
    
    // Direct database connection
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    const client = await pool.connect();
    try {
      // Get the admin user
      const userResult = await client.query(
        'SELECT id, email, password_hash, name FROM admin_users WHERE email = $1',
        ['sales@pixelprint.la']
      );
      
      if (userResult.rows.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Admin user not found'
        });
      }
      
      const user = userResult.rows[0];
      console.log('User found:', {
        id: user.id,
        email: user.email,
        name: user.name,
        hasPasswordHash: !!user.password_hash,
        passwordHashLength: user.password_hash ? user.password_hash.length : 0
      });
      
      // Test password verification
      const password = 'Stitches123';
      console.log('Testing password:', password);
      
      const isValid = await bcrypt.compare(password, user.password_hash);
      console.log('Password valid:', isValid);
      
      return NextResponse.json({
        success: true,
        userFound: true,
        passwordValid: isValid,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          hasPasswordHash: !!user.password_hash,
          passwordHashLength: user.password_hash ? user.password_hash.length : 0
        }
      });
      
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Direct password verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Password verification test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

