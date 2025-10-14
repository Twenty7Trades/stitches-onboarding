import { NextResponse } from 'next/server';
import { adminQueries } from '@/lib/db';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Try to get the admin user
    const user = await adminQueries.getByEmail('sales@pixelprint.la');
    console.log('Database query result:', user ? 'User found' : 'User not found');
    
    if (user) {
      console.log('User details:', {
        id: user.id,
        email: user.email,
        name: user.name,
        hasPasswordHash: !!user.password_hash
      });
    }
    
    return NextResponse.json({
      success: true,
      databaseConnected: true,
      userFound: !!user,
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        hasPasswordHash: !!user.password_hash
      } : null
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
