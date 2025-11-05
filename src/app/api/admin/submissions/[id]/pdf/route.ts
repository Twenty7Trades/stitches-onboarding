import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/simple-auth';
import { customerQueries } from '@/lib/db';
import { decrypt } from '@/lib/encryption';
import { generatePDFBuffer } from '@/lib/pdf-export';
import { Application } from '@/lib/validation';

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

    // Decrypt sensitive data for admin PDF (full payment info)
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
      return NextResponse.json(
        { error: 'Failed to decrypt customer data' },
        { status: 500 }
      );
    }

    // Reconstruct Application object from database record
    const application: Application = {
      businessInfo: {
        businessName: customer.business_name,
        mainEmail: customer.main_email,
        mainContactRep: customer.main_contact_rep || '',
        phone: customer.phone || '',
        asiNumber: customer.asi_number || undefined,
        businessType: customer.business_type as 'Corp.' | 'Partnership' | 'Sole Prop.' | 'LLC.',
        yearsInBusiness: customer.years_in_business || 0,
        einNumber: decryptedEIN,
        estimatedAnnualBusiness: customer.estimated_annual_business || 0,
        averageOrderSize: customer.average_order_size || 0
      },
      billingInfo: {
        billingAddress: customer.billing_address || '',
        billingCity: customer.billing_city || '',
        billingState: customer.billing_state || '',
        billingZip: customer.billing_zip || '',
        billingContact: customer.billing_contact || '',
        billingPhone: customer.billing_phone || '',
        billingEmail: customer.billing_email || ''
      },
      shippingInfo: {
        shippingAddress: customer.shipping_address || '',
        shippingCity: customer.shipping_city || '',
        shippingState: customer.shipping_state || '',
        shippingZip: customer.shipping_zip || '',
        shippingContact: customer.shipping_contact || '',
        shippingPhone: customer.shipping_phone || ''
      },
      paymentMethod: customer.payment_method as 'ACH' | 'CC' | 'NET15',
      paymentDetails: decryptedAuthorizations || {},
      signature: {
        signature: customer.signature_data || ''
      }
    };

    // Generate PDF with full payment information (unmasked)
    const pdfBuffer = await generatePDFBuffer(application, false);

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="stitches-application-${id}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
