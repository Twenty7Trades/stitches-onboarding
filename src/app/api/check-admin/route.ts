import { NextRequest, NextResponse } from 'next/server';
import { adminQueries } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'sales@pixelprint.la';
    
    console.log('Checking admin user for email:', email);
    const user = await adminQueries.getByEmail(email);
    
    return NextResponse.json({
      success: true,
      email: email,
      userExists: !!user,
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        hasPasswordHash: !!user.password_hash
      } : null
    });
  } catch (error) {
    console.error('Check admin user error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check admin user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

