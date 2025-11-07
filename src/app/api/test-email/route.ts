import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json().catch(() => ({}));
    const recipientEmail = testEmail || process.env.NOTIFICATION_EMAIL || 'sales@pixelprint.la';
    
    // Validate SMTP configuration
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const configStatus = {
      SMTP_HOST: smtpHost ? '✅ Set' : '❌ Missing',
      SMTP_PORT: smtpPort ? '✅ Set' : '❌ Missing',
      SMTP_USER: smtpUser ? '✅ Set' : '❌ Missing',
      SMTP_PASS: smtpPass ? '✅ Set' : '❌ Missing',
      SMTP_FROM: process.env.SMTP_FROM || 'Using default',
      NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL || 'Using default (sales@pixelprint.la)'
    };

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      return NextResponse.json({
        success: false,
        error: 'SMTP configuration incomplete',
        configStatus
      }, { status: 400 });
    }

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Verify connection
    let verifyResult = 'unknown';
    try {
      await transporter.verify();
      verifyResult = 'success';
    } catch (verifyError) {
      verifyResult = `failed: ${verifyError instanceof Error ? verifyError.message : 'Unknown error'}`;
      return NextResponse.json({
        success: false,
        error: 'SMTP connection verification failed',
        details: verifyResult,
        configStatus
      }, { status: 500 });
    }

    // Send test email
    const testSubject = 'Test Email - Stitches Onboarding';
    const testBody = `
      <p>This is a test email from the Stitches Onboarding system.</p>
      <p>If you receive this, your SMTP configuration is working correctly.</p>
      <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@stitchesclothingco.com',
      to: recipientEmail,
      subject: testSubject,
      html: testBody,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: info.messageId,
      recipient: recipientEmail,
      configStatus,
      verifyResult
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  const configStatus = {
    SMTP_HOST: process.env.SMTP_HOST ? '✅ Set' : '❌ Missing',
    SMTP_PORT: process.env.SMTP_PORT ? '✅ Set' : '❌ Missing',
    SMTP_USER: process.env.SMTP_USER ? '✅ Set' : '❌ Missing',
    SMTP_PASS: process.env.SMTP_PASS ? '✅ Set' : '❌ Missing',
    SMTP_FROM: process.env.SMTP_FROM || 'Using default',
    NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL || 'Using default (sales@pixelprint.la)'
  };

  return NextResponse.json({
    configStatus,
    message: 'Use POST to send a test email'
  });
}

