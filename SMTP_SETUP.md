# SMTP Email Configuration Guide

This guide will help you configure SMTP settings to send email notifications when forms are submitted.

## Quick Setup Steps

1. Choose your email provider (Gmail, Outlook, or other)
2. Get your SMTP credentials
3. Update the `.env` file in the project root
4. Restart your development server

---

## Gmail Setup (Recommended for Testing)

### Step 1: Enable 2-Factor Authentication
- Go to your Google Account settings
- Enable 2-Factor Authentication if not already enabled

### Step 2: Generate an App Password
1. Go to [Google Account App Passwords](https://myaccount.google.com/apppasswords)
2. Sign in if prompted
3. Select "Mail" as the app
4. Select "Other (Custom name)" as the device
5. Enter "Stitches Onboarding" as the name
6. Click "Generate"
7. Copy the 16-character password (you'll use this as `SMTP_PASS`)

### Step 3: Update .env File
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-character-app-password"
SMTP_FROM="your-email@gmail.com"
NOTIFICATION_EMAIL="sales@pixelprint.la"
```

---

## Outlook/Hotmail Setup

### Step 1: Enable Authenticator App
- Enable Microsoft Authenticator for your account

### Step 2: Generate App Password
1. Go to [Microsoft Account Security](https://account.microsoft.com/security)
2. Click "Advanced security options"
3. Under "App passwords", click "Create a new app password"
4. Copy the generated password

### Step 3: Update .env File
```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_USER="your-email@outlook.com"
SMTP_PASS="your-app-password"
SMTP_FROM="your-email@outlook.com"
NOTIFICATION_EMAIL="sales@pixelprint.la"
```

---

## Other Email Providers

### Common SMTP Settings:

**Yahoo Mail:**
```env
SMTP_HOST="smtp.mail.yahoo.com"
SMTP_PORT="587"
```

**Zoho Mail:**
```env
SMTP_HOST="smtp.zoho.com"
SMTP_PORT="587"
```

**SendGrid (Cloud Email Service):**
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
```

**Mailgun:**
```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_USER="your-mailgun-username"
SMTP_PASS="your-mailgun-password"
```

---

## Security Best Practices

1. **Never commit `.env` file to Git** - It's already in `.gitignore`
2. **Use App Passwords** - Never use your regular account password
3. **Rotate Passwords Regularly** - Change app passwords periodically
4. **Use Environment Variables in Production** - Set these in your hosting platform (Vercel, AWS, etc.)

---

## Testing Your Configuration

After setting up your `.env` file:

1. Restart your development server:
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

2. Submit a test form through the application

3. Check the console logs for any email errors

4. Verify the email was received at `sales@pixelprint.la`

---

## Troubleshooting

### "Invalid login" error
- Make sure you're using an App Password, not your regular password
- Verify your email address is correct
- Check that 2FA is enabled (required for Gmail app passwords)

### "Connection timeout" error
- Check your firewall settings
- Verify SMTP_HOST and SMTP_PORT are correct for your provider
- Some networks block port 587, try port 465 with `secure: true`

### Emails not being received
- Check spam/junk folder
- Verify NOTIFICATION_EMAIL is set to `sales@pixelprint.la`
- Check server console for error messages
- Test SMTP credentials with an email client first

### For Port 465 (SSL/TLS)
If your email provider requires port 465, you may need to update the code in `src/app/api/submit-application/route.ts`:

Change:
```typescript
secure: false,
port: parseInt(process.env.SMTP_PORT || '587'),
```

To:
```typescript
secure: true,
port: parseInt(process.env.SMTP_PORT || '465'),
```

---

## Production Deployment

When deploying to production:

1. **Vercel**: Add environment variables in Project Settings → Environment Variables
2. **AWS**: Use AWS Secrets Manager or environment variables in your deployment config
3. **Other Platforms**: Configure environment variables in your hosting platform's dashboard

Make sure to set all the SMTP variables in your production environment!





