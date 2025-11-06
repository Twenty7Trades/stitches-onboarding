import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';
import { adminQueries } from '@/lib/db';
import { hashPassword } from '@/lib/simple-auth';
import { uuidv4 } from '@/lib/db';

export async function GET() {
  try {
    console.log('Starting database initialization...');
    await initializeDatabase();
    console.log('Database initialization completed');
    
    // Double-check and create admin user if it doesn't exist
    let existingUser;
    try {
      existingUser = await adminQueries.getByEmail('sales@pixelprint.la');
      console.log('Admin user check result:', existingUser ? 'Found' : 'Not found');
    } catch (checkError) {
      console.error('Error checking for admin user:', checkError);
      throw checkError;
    }
    
    if (!existingUser) {
      console.log('Creating admin user via adminQueries.insert...');
      try {
        const adminId = uuidv4();
        const email = 'sales@pixelprint.la';
        const password = 'Stitches123';
        const name = 'Admin User';
        
        const passwordHash = await hashPassword(password);
        console.log('Password hashed, inserting user...');
        await adminQueries.insert(adminId, email, passwordHash, name);
        console.log('Admin user created successfully via adminQueries.insert');
        
        // Verify it was created
        const verifyUser = await adminQueries.getByEmail('sales@pixelprint.la');
        if (verifyUser) {
          console.log('Admin user verified after creation');
        } else {
          console.error('Admin user NOT found after creation - this is a problem!');
        }
      } catch (createError) {
        console.error('Error creating admin user:', createError);
        throw createError;
      }
    } else {
      console.log('Admin user already exists');
    }
    
    // Final verification
    const finalCheck = await adminQueries.getByEmail('sales@pixelprint.la');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully',
      adminUserExists: !!finalCheck,
      adminUserEmail: finalCheck?.email || null
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to initialize database',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
