import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/simple-auth';
import { customerQueries, initializeDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
    const user = await getCurrentUserFromRequest(request);
    
    if (!user) {
      console.log('Admin submissions API: Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Admin submissions API: Fetching customers for user:', user.email);
    
    // Try to get customers
    let customers;
    try {
      customers = await customerQueries.getAll();
      console.log('Admin submissions API: getAll returned', customers?.length || 0, 'customers');
    } catch (error) {
      console.error('Admin submissions API: Error calling getAll:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch customers',
        details: error instanceof Error ? error.message : 'Unknown error',
        customers: []
      });
    }
    
    return NextResponse.json({
      success: true,
      customers: customers || []
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
