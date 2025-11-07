import { NextRequest, NextResponse } from 'next/server';
import { customerQueries } from '@/lib/db';
import { getServerSession } from '@/lib/simple-auth';

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(request);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const businessName = searchParams.get('businessName');

    if (id) {
      await customerQueries.delete(id);
      return NextResponse.json({ 
        success: true, 
        message: `Customer ${id} deleted successfully` 
      });
    } else if (businessName) {
      const result = await customerQueries.deleteByBusinessName(businessName);
      return NextResponse.json({ 
        success: true, 
        message: `All customers with business name "${businessName}" deleted successfully`,
        deletedCount: result.rowCount || 0
      });
    } else {
      return NextResponse.json(
        { error: 'Either id or businessName parameter is required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete customer',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(request);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { businessName } = body;

    if (!businessName) {
      return NextResponse.json(
        { error: 'businessName is required' },
        { status: 400 }
      );
    }

    const result = await customerQueries.deleteByBusinessName(businessName);
    return NextResponse.json({ 
      success: true, 
      message: `All customers with business name "${businessName}" deleted successfully`,
      deletedCount: result.rowCount || 0
    });
  } catch (error) {
    console.error('Error deleting customers:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete customers',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

