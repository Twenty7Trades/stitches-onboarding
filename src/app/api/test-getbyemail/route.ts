import { NextResponse } from 'next/server';
import { adminQueries } from '@/lib/db';

export async function POST() {
  try {
    console.log('Testing adminQueries.getByEmail...');
    
    const email = 'sales@pixelprint.la';
    
    console.log('Calling adminQueries.getByEmail...');
    const user = await adminQueries.getByEmail(email);
    console.log('getByEmail result:', user ? 'User found' : 'User not found');
    
    if (user) {
      console.log('User details:', {
        id: user.id,
        email: user.email,
        name: user.name,
        hasPasswordHash: !!user.password_hash,
        passwordHashLength: user.password_hash ? user.password_hash.length : 0
      });
    }
    
    return NextResponse.json({
      success: true,
      userFound: !!user,
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        hasPasswordHash: !!user.password_hash,
        passwordHashLength: user.password_hash ? user.password_hash.length : 0
      } : null
    });
  } catch (error) {
    console.error('adminQueries.getByEmail test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'adminQueries.getByEmail test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
