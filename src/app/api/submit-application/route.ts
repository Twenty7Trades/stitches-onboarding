import { NextRequest, NextResponse } from 'next/server';
import { applicationSchema, Application } from '@/lib/validation';
import { customerQueries, uuidv4, initializeDatabase } from '@/lib/db';
import { encrypt, getLast4Digits } from '@/lib/encryption';
import { generatePDFBuffer } from '@/lib/pdf-export';
import { formatDateForDisplay } from '@/lib/date-utils';
import nodemailer from 'nodemailer';

// GET method to check deployment version
export async function GET() {
  return NextResponse.json({
    version: '2025-11-06-03',
    deployedAt: new Date().toISOString(),
    codeVersion: 'pdfData-v3',
    message: 'This endpoint confirms the new code is deployed',
    submitApplicationReturns: 'pdfData (NOT csvData)',
    apiRoute: '/api/submit-application'
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Deployment-Version': '2025-11-06-03',
      'X-API-Version': 'pdfData-v3'
    }
  });
}

export async function POST(request: NextRequest) {
  console.log('=== SUBMIT APPLICATION API CALLED - VERSION 2025-11-06-03 ===');
  console.log('This version returns pdfData, NOT csvData');
  
  try {
    // Ensure database is initialized
    await initializeDatabase();
    
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

    // Insert into database FIRST (before PDF generation)
    try {
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
        validatedData.resellerPermit || null, // reseller_permit (optional)
        'pending', // status
        new Date().toISOString(), // submission_date
        new Date().toISOString(), // created_at
        new Date().toISOString()  // updated_at
      ]);
      console.log('Customer inserted successfully, ID:', customerId);
    } catch (dbError) {
      console.error('Database insertion error:', dbError);
      throw new Error(`Failed to save application: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
    }

    // Generate PDF for download (masked for customer)
    // Don't fail the submission if PDF generation fails
    let pdfBuffer: Buffer | null = null;
    let pdfBase64: string | null = null;
    let pdfError: string | null = null;
    try {
      console.log('Generating PDF buffer...');
      pdfBuffer = await generatePDFBuffer(validatedData, true);
      pdfBase64 = pdfBuffer.toString('base64');
      console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');
    } catch (pdfGenError) {
      console.error('Error generating PDF:', pdfGenError);
      pdfError = pdfGenError instanceof Error ? pdfGenError.message : 'Unknown PDF generation error';
      // Don't throw - continue with submission even if PDF fails
    }

    // Send email notification to admin with PDF attachment (only if PDF was generated)
    let emailStatus = 'not_attempted';
    if (pdfBuffer) {
      try {
        emailStatus = await sendAdminNotification(validatedData, customerId, pdfBuffer);
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
    } else {
      emailStatus = 'skipped_no_pdf';
      console.log('Email notification skipped - PDF generation failed');
    }

    // Trigger webhook if configured
    try {
      await triggerWebhook(validatedData, customerId);
    } catch (webhookError) {
      console.error('Failed to trigger webhook:', webhookError);
      // Don't fail the submission if webhook fails
    }

    // Always return JSON response, even if PDF generation failed
    // IMPORTANT: Return pdfData, NOT csvData
    // VERSION: 2025-11-06-03 - Force deployment with version identifier
    console.log('=== RETURNING RESPONSE WITH pdfData ===');
    console.log('pdfBase64 exists:', !!pdfBase64);
    console.log('pdfError:', pdfError);
    
    return NextResponse.json({
      success: true,
      customerId,
      pdfData: pdfBase64, // Will be null if PDF generation failed - this is PDF data, NOT CSV
      pdfError: pdfError || null, // Include PDF error if it failed
      emailStatus, // Include email status for debugging
      message: pdfError ? 'Application saved successfully, but PDF generation failed. You can view it in the admin panel.' : 'Application submitted successfully',
      version: '2025-11-06-03', // Version identifier to verify deployment
      deployedAt: new Date().toISOString()
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Deployment-Version': '2025-11-06-03',
        'X-API-Version': 'pdfData-v3'
      }
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    
    // ALWAYS return JSON, never CSV or HTML
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to submit application', 
          details: error.message, 
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate'
          }
        }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to submit application' 
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    );
  }
}

async function sendAdminNotification(application: Application, customerId: string, pdfBuffer: Buffer): Promise<string> {
  // Validate SMTP configuration
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  // Support multiple email addresses - comma or semicolon separated
  const notificationEmails = (process.env.NOTIFICATION_EMAIL || 'sales@pixelprint.la')
    .split(/[;,]/)
    .map(email => email.trim())
    .filter(email => email.length > 0);

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.error('SMTP configuration incomplete:', {
      host: smtpHost ? 'set' : 'missing',
      port: smtpPort ? 'set' : 'missing',
      user: smtpUser ? 'set' : 'missing',
      pass: smtpPass ? 'set' : 'missing'
    });
    throw new Error('SMTP configuration is incomplete. Please check environment variables.');
  }

  // Use SMTP_USER as from address if SMTP_FROM doesn't match (required by Gmail and many providers)
  const fromAddress = process.env.SMTP_FROM && process.env.SMTP_FROM === smtpUser 
    ? process.env.SMTP_FROM 
    : smtpUser;
  
  console.log('Attempting to send email notification:', {
    host: smtpHost,
    port: smtpPort,
    user: smtpUser,
    to: notificationEmails,
    from: fromAddress,
    note: fromAddress === smtpUser ? 'Using SMTP_USER as from address (required for Gmail compatibility)' : 'Using SMTP_FROM'
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

  const businessName = application.businessInfo.businessName || 'Unknown Business';
  
  const mailOptions = {
    from: fromAddress,
    to: notificationEmails, // Can be array or comma-separated string
    subject: `New onboarding submission from "${businessName}"`,
    html: `
      <p>A new onboarding submission has been received.</p>
      
      <p><strong>Business Name:</strong> ${businessName}</p>
      <p><strong>Contact:</strong> ${application.businessInfo.mainContactRep || 'N/A'}</p>
      <p><strong>Email:</strong> ${application.businessInfo.mainEmail}</p>
      <p><strong>Phone:</strong> ${application.businessInfo.phone || 'N/A'}</p>
      <p><strong>Payment Method:</strong> ${application.paymentMethod}</p>
      <p><strong>Application ID:</strong> ${customerId}</p>
      <p><strong>Submitted:</strong> ${formatDateForDisplay()}</p>
      
      <p>Please see the attached PDF for complete application details.</p>
    `,
    attachments: [
      {
        filename: `stitches-application-${customerId}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
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
