import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';
import { adminQueries } from '@/lib/db';
import { hashPassword } from '@/lib/simple-auth';
import { uuidv4 } from '@/lib/db';

export async function GET() {
  try {
    await initializeDatabase();
    
    // Create admin user if it doesn't exist
    const existingUser = await adminQueries.getByEmail('sales@pixelprint.la');
    if (!existingUser) {
      console.log('Creating admin user...');
      const adminId = uuidv4();
      const email = 'sales@pixelprint.la';
      const password = 'Stitches123';
      const name = 'Admin User';
      
      const passwordHash = await hashPassword(password);
      await adminQueries.insert(adminId, email, passwordHash, name);
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully' 
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to initialize database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
