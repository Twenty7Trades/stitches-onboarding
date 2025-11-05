import { NextRequest, NextResponse } from 'next/server';
import { applicationSchema, Application } from '@/lib/validation';
import { customerQueries, uuidv4 } from '@/lib/db';
import { encrypt, getLast4Digits } from '@/lib/encryption';
import { generatePDFBuffer } from '@/lib/pdf-export';
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
      validatedData.businessInfo.asiNumber || '',
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
      paymentCardLast4 || '',
      paymentCardType || '',
      paymentAccountLast4 || '',
      paymentAccountType || '',
      encryptedAuthorizations,
      validatedData.signature.signature,
      'pending', // status
      new Date().toISOString(), // submission_date
      new Date().toISOString(), // created_at
      new Date().toISOString()  // updated_at
    ]);
    console.log('Customer inserted successfully, ID:', customerId);

    // Generate PDF for download (masked for customer)
    let pdfBuffer: Buffer;
    let pdfBase64: string;
    try {
      console.log('Generating PDF buffer...');
      pdfBuffer = await generatePDFBuffer(validatedData, true);
      pdfBase64 = pdfBuffer.toString('base64');
      console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');
    } catch (pdfError) {
      console.error('Error generating PDF:', pdfError);
      throw new Error(`PDF generation failed: ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}`);
    }

    // Send email notification to admin
    let emailStatus = 'not_attempted';
    try {
      emailStatus = await sendAdminNotification(validatedData, customerId);
      console.log('Email notification sent successfully:', emailStatus);
    } catch (emailError) {
      emailStatus = 'failed';
      console.error('Failed to send admin notification:', emailError);
      if (emailError instanceof Error) {
        console.error('Email error details:', {
          message: emailError.message,
          stack: emailError.stack,
          smtpHost: process.env.SMTP_HOST || 'not set',
          smtpPort: process.env.SMTP_PORT || 'not set',
          smtpUser: process.env.SMTP_USER ? 'set' : 'not set',
          smtpPass: process.env.SMTP_PASS ? 'set' : 'not set',
          notificationEmail: process.env.NOTIFICATION_EMAIL || 'not set'
        });
      }
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
      pdfData: pdfBase64,
      emailStatus // Include email status for debugging
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

async function sendAdminNotification(application: Application, customerId: string): Promise<string> {
  // Validate SMTP configuration
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const notificationEmail = process.env.NOTIFICATION_EMAIL || 'sales@pixelprint.la';

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.error('SMTP configuration incomplete:', {
      host: smtpHost ? 'set' : 'missing',
      port: smtpPort ? 'set' : 'missing',
      user: smtpUser ? 'set' : 'missing',
      pass: smtpPass ? 'set' : 'missing'
    });
    throw new Error('SMTP configuration is incomplete. Please check environment variables.');
  }

  console.log('Attempting to send email notification:', {
    host: smtpHost,
    port: smtpPort,
    user: smtpUser,
    to: notificationEmail,
    from: process.env.SMTP_FROM || 'noreply@stitchesclothingco.com'
  });

  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort),
    secure: parseInt(smtpPort) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    // Add connection timeout
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  // Verify connection
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');
  } catch (verifyError) {
    console.error('SMTP connection verification failed:', verifyError);
    throw new Error(`SMTP connection failed: ${verifyError instanceof Error ? verifyError.message : 'Unknown error'}`);
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@stitchesclothingco.com',
    to: notificationEmail,
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

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent successfully:', {
    messageId: info.messageId,
    response: info.response,
    accepted: info.accepted,
    rejected: info.rejected
  });
  
  return 'sent';
}

async function triggerWebhook(application: Application, customerId: string) {
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
