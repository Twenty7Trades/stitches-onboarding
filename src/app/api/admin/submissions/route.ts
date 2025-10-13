import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { customerQueries } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customers = customerQueries.getAll();
    
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
