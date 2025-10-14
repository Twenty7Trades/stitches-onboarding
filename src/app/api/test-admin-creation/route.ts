import { NextResponse } from 'next/server';
import { adminQueries } from '@/lib/db';
import { hashPassword } from '@/lib/simple-auth';
import { uuidv4 } from '@/lib/db';

export async function POST() {
  try {
    console.log('Testing direct admin user creation...');
    
    // Create a test admin user with a unique email
    const testEmail = `test-${Date.now()}@example.com`;
    const adminId = uuidv4();
    const password = 'Test123';
    const name = 'Test Admin';
    
    console.log('Creating test user with email:', testEmail);
    
    // Hash password
    const passwordHash = await hashPassword(password);
    console.log('Password hashed successfully');
    
    // Insert user
    await adminQueries.insert(adminId, testEmail, passwordHash, name);
    console.log('User inserted successfully');
    
    // Try to retrieve the user
    const retrievedUser = await adminQueries.getByEmail(testEmail);
    console.log('Retrieved user:', retrievedUser ? 'Found' : 'Not found');
    
    if (retrievedUser) {
      console.log('User details:', {
        id: retrievedUser.id,
        email: retrievedUser.email,
        name: retrievedUser.name,
        hasPasswordHash: !!retrievedUser.password_hash
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Test user created and retrieved successfully',
      testEmail: testEmail,
      userCreated: !!retrievedUser,
      user: retrievedUser ? {
        id: retrievedUser.id,
        email: retrievedUser.email,
        name: retrievedUser.name,
        hasPasswordHash: !!retrievedUser.password_hash
      } : null
    });
  } catch (error) {
    console.error('Test admin user creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Test admin user creation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
