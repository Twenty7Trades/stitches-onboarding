import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { customerQueries } from '@/lib/db';
import { decrypt } from '@/lib/encryption';
import { generateCSVBuffer } from '@/lib/csv-export';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';

    if (!['csv', 'json'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    const customers = customerQueries.getAll();

    if (format === 'json') {
      // For JSON export, include decrypted data
      const customersWithDecryptedData = customers.map(customer => {
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
          console.error('Error decrypting data for export:', error);
        }

        return {
          ...customer,
          ein_number_decrypted: decryptedEIN,
          payment_authorizations_decrypted: decryptedAuthorizations
        };
      });

      const jsonData = JSON.stringify(customersWithDecryptedData, null, 2);
      
      return new NextResponse(jsonData, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="stitches-customers.json"'
        }
      });
    }

    // CSV export
    const csvData = customers.map(customer => {
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
        console.error('Error decrypting data for CSV export:', error);
      }

      // Create CSV row with all data
      const row: Record<string, string | number> = {
        'ID': customer.id,
        'Business Name': customer.business_name,
        'Main Email': customer.main_email,
        'Main Contact Rep': customer.main_contact_rep,
        'Phone': customer.phone,
        'ASI Number': customer.asi_number || '',
        'Business Type': customer.business_type,
        'Years in Business': customer.years_in_business,
        'EIN Number': decryptedEIN,
        'Estimated Annual Business': customer.estimated_annual_business,
        'Average Order Size': customer.average_order_size,
        'Billing Address': customer.billing_address,
        'Billing City': customer.billing_city,
        'Billing State': customer.billing_state,
        'Billing Zip': customer.billing_zip,
        'Billing Contact': customer.billing_contact,
        'Billing Phone': customer.billing_phone,
        'Billing Email': customer.billing_email,
        'Shipping Address': customer.shipping_address,
        'Shipping City': customer.shipping_city,
        'Shipping State': customer.shipping_state,
        'Shipping Zip': customer.shipping_zip,
        'Shipping Contact': customer.shipping_contact,
        'Shipping Phone': customer.shipping_phone,
        'Payment Method': customer.payment_method,
        'Payment Card Last 4': customer.payment_card_last4 || '',
        'Payment Card Type': customer.payment_card_type || '',
        'Payment Account Last 4': customer.payment_account_last4 || '',
        'Payment Account Type': customer.payment_account_type || '',
        'Status': customer.status,
        'Submission Date': customer.submission_date,
        'Created At': customer.created_at,
        'Updated At': customer.updated_at
      };

      // Add decrypted payment details if available
      if (decryptedAuthorizations) {
        if (customer.payment_method === 'ACH') {
          row['Account Holder Name'] = decryptedAuthorizations.accountHolderName || '';
          row['Account Type'] = decryptedAuthorizations.accountType || '';
          row['Routing Number'] = decryptedAuthorizations.routingNumber || '';
          row['Account Number'] = decryptedAuthorizations.accountNumber || '';
        } else if (customer.payment_method === 'CC' || customer.payment_method === 'NET15') {
          row['Cardholder Name'] = decryptedAuthorizations.cardholderName || '';
          row['Card Type'] = decryptedAuthorizations.cardType || '';
          row['Card Number'] = decryptedAuthorizations.cardNumber || '';
          row['Expiration Date'] = decryptedAuthorizations.expirationDate || '';
          row['CVC Number'] = decryptedAuthorizations.cvcNumber || '';
          row['Billing Zip Code'] = decryptedAuthorizations.billingZipCode || '';
        }
      }

      return row;
    });

    const csvBuffer = generateCSVBuffer(csvData);
    
    return new NextResponse(csvBuffer, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="stitches-customers.csv"'
      }
    });

  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
