import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/simple-auth';
import { customerQueries } from '@/lib/db';
import { decrypt } from '@/lib/encryption';

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
    const customer = await customerQueries.getById(id);
    
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Decrypt sensitive data for admin view
    let decryptedEIN = '';
    let decryptedAuthorizations = null;
    
    try {
      if (customer.ein_number_encrypted) {
        decryptedEIN = decrypt(customer.ein_number_encrypted);
      }
      if (customer.payment_authorizations_encrypted) {
        decryptedAuthorizations = JSON.parse(decrypt(customer.payment_authorizations_encrypted));
      }
    } catch (error) {
      console.error('Error decrypting data:', error);
    }

    const customerData = {
      ...customer,
      ein_number_decrypted: decryptedEIN,
      payment_authorizations_decrypted: decryptedAuthorizations
    };

    return NextResponse.json({
      success: true,
      customer: customerData
    });

  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await customerQueries.updateStatus(status, id);

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully'
    });

  } catch (error) {
    console.error('Error updating customer status:', error);
    return NextResponse.json(
      { error: 'Failed to update customer status' },
      { status: 500 }
    );
  }
}
