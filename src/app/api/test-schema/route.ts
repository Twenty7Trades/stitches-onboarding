import { NextResponse } from 'next/server';
import { adminQueries } from '@/lib/db';

export async function GET() {
  try {
    console.log('Testing database schema...');
    
    // Test if we can query the admin_users table using adminQueries
    const user = await adminQueries.getByEmail('sales@pixelprint.la');
    console.log('Admin user query result:', user ? 'User found' : 'User not found');
    
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
      userFound: !!user,
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        hasPasswordHash: !!user.password_hash
      } : null
    });
  } catch (error) {
    console.error('Database schema test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database schema test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
