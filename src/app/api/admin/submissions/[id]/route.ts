import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { customerQueries } from '@/lib/db';
import { decrypt } from '@/lib/encryption';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customer = customerQueries.getById(params.id);
    
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    customerQueries.updateStatus(status, params.id);

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
