import { NextResponse } from 'next/server';
import { adminQueries } from '@/lib/db';
import { verifyPassword } from '@/lib/simple-auth';

export async function POST() {
  try {
    console.log('Testing password verification...');
    
    // Get the admin user
    const user = await adminQueries.getByEmail('sales@pixelprint.la');
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Admin user not found'
      });
    }
    
    console.log('User details:', {
      id: user.id,
      email: user.email,
      name: user.name,
      hasPasswordHash: !!user.password_hash,
      passwordHashLength: user.password_hash ? user.password_hash.length : 0
    });
    
    // Test password verification
    const password = 'Stitches123';
    console.log('Testing password:', password);
    
    const isValid = await verifyPassword(password, user.password_hash);
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
  } catch (error) {
    console.error('Password verification test error:', error);
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
