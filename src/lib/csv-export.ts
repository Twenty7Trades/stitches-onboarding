import { createObjectCsvWriter } from 'csv-writer';
import { Application } from './validation';

export function generateCSVData(application: Application) {
  const data: Record<string, string | number> = {
    // Business Information
    'Business Name': application.businessInfo.businessName,
    'Main Email': application.businessInfo.mainEmail,
    'Main Contact Rep': application.businessInfo.mainContactRep,
    'Phone': application.businessInfo.phone,
    'ASI/PPAI/SAGE #': application.businessInfo.asiNumber || '',
    'Business Type': application.businessInfo.businessType,
    'Years in Business': application.businessInfo.yearsInBusiness,
    'EIN Number': application.businessInfo.einNumber,
    'Estimated Annual Business': application.businessInfo.estimatedAnnualBusiness,
    'Average Order Size': application.businessInfo.averageOrderSize,
    
    // Billing Information
    'Billing Address': application.billingInfo.billingAddress,
    'Billing City': application.billingInfo.billingCity,
    'Billing State': application.billingInfo.billingState,
    'Billing Zip': application.billingInfo.billingZip,
    'Billing Contact': application.billingInfo.billingContact,
    'Billing Phone': application.billingInfo.billingPhone,
    'Billing Email': application.billingInfo.billingEmail,
    
    // Shipping Information
    'Shipping Address': application.shippingInfo.shippingAddress,
    'Shipping City': application.shippingInfo.shippingCity,
    'Shipping State': application.shippingInfo.shippingState,
    'Shipping Zip': application.shippingInfo.shippingZip,
    'Shipping Contact': application.shippingInfo.shippingContact,
    'Shipping Phone': application.shippingInfo.shippingPhone,
    
    // Payment Information
    'Payment Method': application.paymentMethod,
  };

  // Add payment-specific fields
  if (application.paymentMethod === 'ACH') {
    const achDetails = application.paymentDetails as { accountHolderName: string; accountType: string; routingNumber: string; accountNumber: string };
    data['Account Holder Name'] = achDetails.accountHolderName;
    data['Account Type'] = achDetails.accountType;
    data['Routing Number'] = achDetails.routingNumber;
    data['Account Number'] = achDetails.accountNumber;
  } else if (application.paymentMethod === 'CC' || application.paymentMethod === 'NET15') {
    const ccDetails = application.paymentDetails as { cardholderName: string; cardType: string; cardNumber: string; expirationDate: string; cvcNumber: string; billingZipCode: string };
    data['Cardholder Name'] = ccDetails.cardholderName;
    data['Card Type'] = ccDetails.cardType;
    data['Card Number'] = ccDetails.cardNumber;
    data['Expiration Date'] = ccDetails.expirationDate;
    data['CVC Number'] = ccDetails.cvcNumber;
    data['Billing Zip Code'] = ccDetails.billingZipCode;
  }

  // Add signature timestamp
  data['Signature Date'] = new Date().toISOString();
  data['Submission Date'] = new Date().toISOString();

  return data;
}

export function createCSVWriter(path: string) {
  return createObjectCsvWriter({
    path,
    header: [
      { id: 'Business Name', title: 'Business Name' },
      { id: 'Main Email', title: 'Main Email' },
      { id: 'Main Contact Rep', title: 'Main Contact Rep' },
      { id: 'Phone', title: 'Phone' },
      { id: 'ASI/PPAI/SAGE #', title: 'ASI/PPAI/SAGE #' },
      { id: 'Business Type', title: 'Business Type' },
      { id: 'Years in Business', title: 'Years in Business' },
      { id: 'EIN Number', title: 'EIN Number' },
      { id: 'Estimated Annual Business', title: 'Estimated Annual Business' },
      { id: 'Average Order Size', title: 'Average Order Size' },
      { id: 'Billing Address', title: 'Billing Address' },
      { id: 'Billing City', title: 'Billing City' },
      { id: 'Billing State', title: 'Billing State' },
      { id: 'Billing Zip', title: 'Billing Zip' },
      { id: 'Billing Contact', title: 'Billing Contact' },
      { id: 'Billing Phone', title: 'Billing Phone' },
      { id: 'Billing Email', title: 'Billing Email' },
      { id: 'Shipping Address', title: 'Shipping Address' },
      { id: 'Shipping City', title: 'Shipping City' },
      { id: 'Shipping State', title: 'Shipping State' },
      { id: 'Shipping Zip', title: 'Shipping Zip' },
      { id: 'Shipping Contact', title: 'Shipping Contact' },
      { id: 'Shipping Phone', title: 'Shipping Phone' },
      { id: 'Payment Method', title: 'Payment Method' },
      { id: 'Account Holder Name', title: 'Account Holder Name' },
      { id: 'Account Type', title: 'Account Type' },
      { id: 'Routing Number', title: 'Routing Number' },
      { id: 'Account Number', title: 'Account Number' },
      { id: 'Cardholder Name', title: 'Cardholder Name' },
      { id: 'Card Type', title: 'Card Type' },
      { id: 'Card Number', title: 'Card Number' },
      { id: 'Expiration Date', title: 'Expiration Date' },
      { id: 'CVC Number', title: 'CVC Number' },
      { id: 'Billing Zip Code', title: 'Billing Zip Code' },
      { id: 'Signature Date', title: 'Signature Date' },
      { id: 'Submission Date', title: 'Submission Date' }
    ]
  });
}

export function generateCSVBuffer(data: Record<string, string | number>[]): Buffer {
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  return Buffer.from(csvContent, 'utf-8');
}
