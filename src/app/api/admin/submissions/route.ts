import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/simple-auth';
import { customerQueries } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customers = await customerQueries.getAll();
    
    return NextResponse.json({
      success: true,
      customers
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
