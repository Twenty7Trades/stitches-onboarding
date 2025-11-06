import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from '@/lib/simple-auth';

// Direct admin user creation endpoint - bypasses normal initialization
// Call this once to set up the admin user immediately
// Supports both GET (browser) and POST (programmatic) requests
export async function GET(request: NextRequest) {
  return await setupAdmin();
}

export async function POST(request: NextRequest) {
  return await setupAdmin();
}

async function setupAdmin() {
  try {
    // Get database URL from environment
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl || !databaseUrl.startsWith('postgresql://')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'DATABASE_URL not configured or not PostgreSQL' 
        },
        { status: 500 }
      );
    }

    // Create direct connection (bypass connection pool)
    const client = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    }).connect();

    try {
      const dbClient = await client;
      
      // Ensure admin_users table exists
      await dbClient.query(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id VARCHAR(36) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          name VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP
        )
      `);

      // Check if user exists
      const checkResult = await dbClient.query(`
        SELECT * FROM admin_users WHERE email = $1
      `, ['sales@pixelprint.la']);

      if (checkResult.rows.length > 0) {
        await dbClient.release();
        return NextResponse.json({
          success: true,
          message: 'Admin user already exists',
          user: {
            id: checkResult.rows[0].id,
            email: checkResult.rows[0].email,
            name: checkResult.rows[0].name
          }
        });
      }

      // Create admin user
      const adminId = uuidv4();
      const passwordHash = await hashPassword('Stitches123');
      
      const insertResult = await dbClient.query(`
        INSERT INTO admin_users (id, email, password_hash, name) 
        VALUES ($1, $2, $3, $4)
      `, [adminId, 'sales@pixelprint.la', passwordHash, 'Admin User']);

      // Verify creation
      const verifyResult = await dbClient.query(`
        SELECT * FROM admin_users WHERE email = $1
      `, ['sales@pixelprint.la']);

      await dbClient.release();

      if (verifyResult.rows.length > 0) {
        return NextResponse.json({
          success: true,
          message: 'Admin user created successfully',
          user: {
            id: verifyResult.rows[0].id,
            email: verifyResult.rows[0].email,
            name: verifyResult.rows[0].name
          }
        }, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Admin user creation failed - user not found after insert' 
          },
          { status: 500 }
        );
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('Setup admin error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to setup admin user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

