# AWS Amplify SMTP Configuration Guide

## Quick Steps to Configure SMTP in AWS Amplify

### Step 1: Access AWS Amplify Console
1. Go to: https://console.aws.amazon.com/amplify
2. Sign in to your AWS account
3. Select your app: **stitches-onboarding** (or similar)

### Step 2: Navigate to Environment Variables
1. In the left sidebar, click **"Environment variables"**
2. Click **"Manage variables"** button
3. You'll see a list of existing variables (if any)

### Step 3: Add SMTP Environment Variables

Click **"Add variable"** and add each of these one by one:

| Variable Name | Example Value | Description |
|--------------|---------------|-------------|
| `SMTP_HOST` | `smtp.gmail.com` | Your email provider's SMTP server |
| `SMTP_PORT` | `587` | SMTP port (587 for TLS, 465 for SSL) |
| `SMTP_USER` | `your-email@gmail.com` | Your email address for authentication |
| `SMTP_PASS` | `abcd efgh ijkl mnop` | Your app password (no spaces) |
| `SMTP_FROM` | `noreply@stitchesclothingco.com` | The "from" email address |
| `NOTIFICATION_EMAIL` | `sales@pixelprint.la` | Where to send form submissions |

### Step 4: Save and Redeploy

1. Click **"Save"** after adding all variables
2. Go back to the main app page
3. Click on your branch (likely **"main"**)
4. Click **"Redeploy this version"** or wait for automatic redeployment

### Step 5: Verify Configuration

1. Wait for deployment to complete (usually 2-5 minutes)
2. Test by submitting a form on your live site
3. Check if email is received at `sales@pixelprint.la`

---

## Gmail App Password Setup (if not done already)

Before adding SMTP_PASS, you need to create a Gmail App Password:

1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Name it "Stitches Onboarding AWS"
4. Click "Generate"
5. Copy the 16-character password (remove spaces when pasting)
6. Use this password for `SMTP_PASS` in Amplify

---

## Alternative Email Providers

If not using Gmail, update `SMTP_HOST` and `SMTP_PORT` accordingly:

**Outlook/Hotmail:**
- `SMTP_HOST`: `smtp-mail.outlook.com`
- `SMTP_PORT`: `587`

**Yahoo:**
- `SMTP_HOST`: `smtp.mail.yahoo.com`
- `SMTP_PORT`: `587`

**SendGrid:**
- `SMTP_HOST`: `smtp.sendgrid.net`
- `SMTP_PORT`: `587`
- `SMTP_USER`: `apikey`
- `SMTP_PASS`: Your SendGrid API key

---

## Troubleshooting

### Emails Not Sending
1. Check Amplify build logs for errors
2. Verify all SMTP variables are set correctly
3. Ensure Gmail App Password is valid (not expired)
4. Check spam folder at `sales@pixelprint.la`

### "Invalid login" Error
- Verify `SMTP_USER` matches the email used to create App Password
- Ensure `SMTP_PASS` has no spaces
- Try regenerating App Password

### Deployment Issues
- Check Amplify build logs in the "Build history" section
- Verify environment variables are saved (no typos in names)
- Ensure variable names are uppercase (SMTP_HOST, not smtp_host)

---

## Current Live App
- **URL**: https://main.d3t8wpufosawhp.amplifyapp.com/
- **Amplify Console**: https://console.aws.amazon.com/amplify

---

## Security Notes

- ✅ Environment variables in Amplify are encrypted at rest
- ✅ They are only accessible during build/runtime
- ✅ Never commit `.env` files to your repository (already in `.gitignore`)
- ✅ App Passwords are safer than regular passwords

---

## Quick Checklist

- [ ] Created Gmail App Password
- [ ] Added `SMTP_HOST` variable
- [ ] Added `SMTP_PORT` variable
- [ ] Added `SMTP_USER` variable
- [ ] Added `SMTP_PASS` variable
- [ ] Added `SMTP_FROM` variable
- [ ] Added `NOTIFICATION_EMAIL` variable
- [ ] Saved all variables
- [ ] Redeployed the application
- [ ] Tested form submission
- [ ] Verified email received

---

## Need Help?

If you encounter issues:
1. Check AWS Amplify build logs
2. Verify environment variables are set correctly
3. Test SMTP credentials with a simple email client first
4. Review the SMTP_SETUP.md file for more detailed troubleshooting






