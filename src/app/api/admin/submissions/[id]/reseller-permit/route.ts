import { NextRequest, NextResponse } from 'next/server';
import { customerQueries } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/simple-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const customers = await customerQueries.getAll();
    const customer = customers.find((c: any) => c.id === id);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    if (!customer.reseller_permit) {
      return NextResponse.json({ error: 'Reseller permit not found' }, { status: 404 });
    }

    // Extract base64 data (remove data:image/png;base64, or data:application/pdf;base64, prefix if present)
    let base64Data = customer.reseller_permit;
    const base64Match = base64Data.match(/^data:([^;]+);base64,(.+)$/);
    if (base64Match) {
      base64Data = base64Match[2];
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // Determine content type from the original data URL or default to PDF
    let contentType = 'application/pdf';
    if (base64Match && base64Match[1]) {
      contentType = base64Match[1];
    } else if (customer.reseller_permit.startsWith('data:image/')) {
      contentType = customer.reseller_permit.split(';')[0].split(':')[1];
    }

    // Determine file extension
    let extension = 'pdf';
    if (contentType.includes('jpeg') || contentType.includes('jpg')) {
      extension = 'jpg';
    } else if (contentType.includes('png')) {
      extension = 'png';
    } else if (contentType.includes('gif')) {
      extension = 'gif';
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="reseller-permit-${id}.${extension}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching reseller permit:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch reseller permit',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

