import { NextResponse } from 'next/server';
import { adminQueries } from '@/lib/db';
import { hashPassword } from '@/lib/simple-auth';
import { uuidv4 } from '@/lib/db';

export async function POST() {
  try {
    console.log('Creating admin user...');
    
    // Check if admin user already exists
    const existingUser = await adminQueries.getByEmail('sales@pixelprint.la');
    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'Admin user already exists',
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name
        }
      });
    }
    
    // Create new admin user
    const adminId = uuidv4();
    const email = 'sales@pixelprint.la';
    const password = 'Stitches123';
    const name = 'Admin User';
    
    console.log('Hashing password...');
    const passwordHash = await hashPassword(password);
    console.log('Password hashed successfully');
    
    console.log('Inserting admin user...');
    await adminQueries.insert(adminId, email, passwordHash, name);
    console.log('Admin user inserted successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: adminId,
        email: email,
        name: name
      }
    });
  } catch (error) {
    console.error('Create admin user error:', error);
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

