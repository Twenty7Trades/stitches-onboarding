import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/simple-auth';

export async function POST() {
  try {
    console.log('Testing authentication system...');
    
    const email = 'sales@pixelprint.la';
    const password = 'Stitches123';
    
    console.log('Calling authenticateUser...');
    const user = await authenticateUser(email, password);
    console.log('AuthenticateUser result:', user ? 'User authenticated' : 'Authentication failed');
    
    if (user) {
      console.log('User details:', {
        id: user.id,
        email: user.email,
        name: user.name
      });
    }
    
    return NextResponse.json({
      success: true,
      authenticated: !!user,
      user: user || null
    });
  } catch (error) {
    console.error('Authentication system test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Authentication system test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
