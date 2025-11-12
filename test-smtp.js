// Quick SMTP test script
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'sales@pixelprint.la',
    pass: 'axjiogpygiveqspq',
  },
});

async function testEmail() {
  try {
    console.log('Testing SMTP connection...');
    
    // Verify connection
    await transporter.verify();
    console.log('✓ SMTP connection verified successfully!');
    
    // Send test email
    const info = await transporter.sendMail({
      from: 'noreply@stitchesclothingco.com',
      to: 'sales@pixelprint.la',
      subject: 'Test Email from Stitches Onboarding',
      html: `
        <h2>SMTP Test Email</h2>
        <p>This is a test email to verify SMTP configuration.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      `,
    });
    
    console.log('✓ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    
  } catch (error) {
    console.error('✗ SMTP Error:', error.message);
    console.error('Full error:', error);
    
    if (error.code === 'EAUTH') {
      console.error('\n⚠️  Authentication failed!');
      console.error('Please verify:');
      console.error('  - SMTP_USER is correct');
      console.error('  - SMTP_PASS is a valid App Password');
      console.error('  - 2FA is enabled on the Google account');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION') {
      console.error('\n⚠️  Connection failed!');
      console.error('Please verify:');
      console.error('  - SMTP_HOST is correct');
      console.error('  - SMTP_PORT is correct');
      console.error('  - Firewall is not blocking port 587');
    }
  }
}

testEmail();






