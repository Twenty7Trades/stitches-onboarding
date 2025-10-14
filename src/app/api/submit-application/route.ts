import { NextRequest, NextResponse } from 'next/server';
import { applicationSchema } from '@/lib/validation';
import { customerQueries, uuidv4 } from '@/lib/db';
import { encrypt, getLast4Digits } from '@/lib/encryption';
import { generateCSVData, generateCSVBuffer } from '@/lib/csv-export';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = applicationSchema.parse(body);

    // Generate unique ID
    const customerId = uuidv4();

    // Extract payment details for storage (only last 4 digits)
    let paymentCardLast4 = '';
    let paymentCardType = '';
    let paymentAccountLast4 = '';
    let paymentAccountType = '';

    if (validatedData.paymentMethod === 'ACH') {
      const achDetails = validatedData.paymentDetails as { accountNumber: string; accountType: string };
      paymentAccountLast4 = getLast4Digits(achDetails.accountNumber);
      paymentAccountType = achDetails.accountType;
    } else if (validatedData.paymentMethod === 'CC' || validatedData.paymentMethod === 'NET15') {
      const ccDetails = validatedData.paymentDetails as { cardNumber: string; cardType: string };
      paymentCardLast4 = getLast4Digits(ccDetails.cardNumber);
      paymentCardType = ccDetails.cardType;
    }

    // Encrypt sensitive data
    const encryptedEIN = encrypt(validatedData.businessInfo.einNumber);
    const encryptedAuthorizations = encrypt(JSON.stringify(validatedData.paymentDetails));

    // Insert into database
    await customerQueries.insert([
      customerId,
      validatedData.businessInfo.businessName,
      validatedData.businessInfo.mainEmail,
      validatedData.businessInfo.mainContactRep,
      validatedData.businessInfo.phone,
      validatedData.businessInfo.asiNumber || null,
      validatedData.businessInfo.businessType,
      validatedData.businessInfo.yearsInBusiness,
      encryptedEIN,
      validatedData.businessInfo.estimatedAnnualBusiness,
      validatedData.businessInfo.averageOrderSize,
      validatedData.billingInfo.billingAddress,
      validatedData.billingInfo.billingCity,
      validatedData.billingInfo.billingState,
      validatedData.billingInfo.billingZip,
      validatedData.billingInfo.billingContact,
      validatedData.billingInfo.billingPhone,
      validatedData.billingInfo.billingEmail,
      validatedData.shippingInfo.shippingAddress,
      validatedData.shippingInfo.shippingCity,
      validatedData.shippingInfo.shippingState,
      validatedData.shippingInfo.shippingZip,
      validatedData.shippingInfo.shippingContact,
      validatedData.shippingInfo.shippingPhone,
      validatedData.paymentMethod,
      paymentCardLast4 || null,
      paymentCardType || null,
      paymentAccountLast4 || null,
      paymentAccountType || null,
      encryptedAuthorizations,
      validatedData.signature.signature
    ]);

    // Generate CSV data for download
    const csvData = generateCSVData(validatedData);
    const csvBuffer = generateCSVBuffer([csvData]);
    const csvBase64 = csvBuffer.toString('base64');

    // Send email notification to admin
    try {
      await sendAdminNotification(validatedData, customerId);
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      // Don't fail the submission if email fails
    }

    // Trigger webhook if configured
    try {
      await triggerWebhook(validatedData, customerId);
    } catch (webhookError) {
      console.error('Failed to trigger webhook:', webhookError);
      // Don't fail the submission if webhook fails
    }

    return NextResponse.json({
      success: true,
      customerId,
      csvData: csvBase64
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    
    // Return more detailed error information for debugging
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to submit application', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

async function sendAdminNotification(application: unknown, customerId: string) {
  // Configure nodemailer (you'll need to set up SMTP settings)
  const transporter = nodemailer.createTransporter({
    // Configure with your email provider
    // For now, we'll use a placeholder configuration
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@stitchesclothingco.com',
    to: 'sales@pixelprint.la',
    subject: 'New Customer Application - Stitches Clothing Co',
    html: `
      <h2>New Customer Application Received</h2>
      <p><strong>Business Name:</strong> ${application.businessInfo.businessName}</p>
      <p><strong>Contact:</strong> ${application.businessInfo.mainContactRep}</p>
      <p><strong>Email:</strong> ${application.businessInfo.mainEmail}</p>
      <p><strong>Phone:</strong> ${application.businessInfo.phone}</p>
      <p><strong>Payment Method:</strong> ${application.paymentMethod}</p>
      <p><strong>Application ID:</strong> ${customerId}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      
      <p>Please log into the admin portal to review the full application.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

async function triggerWebhook(application: unknown, customerId: string) {
  const webhookUrl = process.env.WEBHOOK_URL;
  
  if (!webhookUrl) {
    return; // No webhook configured
  }

  const webhookData = {
    event: 'customer_application_submitted',
    customerId,
    timestamp: new Date().toISOString(),
    businessName: application.businessInfo.businessName,
    email: application.businessInfo.mainEmail,
    paymentMethod: application.paymentMethod,
    // Don't include sensitive payment data in webhook
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.WEBHOOK_SECRET || ''}`,
    },
    body: JSON.stringify(webhookData),
  });

  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status}`);
  }
}
