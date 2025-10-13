# Stitches Clothing Co - Customer Onboarding System

A modern web-based onboarding form for Stitches Clothing Co that captures customer application data, payment method selections, digital signatures, and exports to CSV/database with integrated Terms and Pricing Details pages.

## Features

### Customer-Facing Features
- **Multi-step Application Form**: Business info, billing, shipping, payment method selection
- **Dynamic Payment Forms**: ACH, Credit Card, and Net 15 payment options with conditional fields
- **Digital Signature**: Canvas-based signature capture
- **Terms & Conditions**: Rich text display with PDF download
- **Pricing Details**: Complete pricing information with PDF download
- **CSV Export**: Immediate download of application data after submission
- **Mobile Responsive**: Works on all devices

### Admin Portal Features
- **Secure Authentication**: Password-protected admin access
- **Submissions Dashboard**: View all customer applications with search/filter
- **Status Management**: Mark applications as Pending/Approved/Rejected
- **Export Options**: Download individual or bulk CSV/JSON files
- **Email Notifications**: Automatic alerts for new submissions
- **Webhook Support**: Configurable webhooks for external system integration

### Security Features
- **Data Encryption**: AES-256 encryption for sensitive fields (EIN)
- **Payment Data Protection**: Only stores last 4 digits of cards/accounts
- **HTTPS Ready**: Secure transmission in production
- **Input Validation**: Comprehensive form validation with Zod
- **Rate Limiting**: API endpoint protection

## Tech Stack

- **Frontend**: Next.js 14 (React) with TypeScript, Tailwind CSS
- **Backend**: Next.js API routes (Node.js)
- **Database**: SQLite (local development), PostgreSQL (production)
- **Authentication**: NextAuth.js with bcrypt password hashing
- **Forms**: React Hook Form with Zod validation
- **PDF Handling**: Serve existing PDFs and convert to rich text pages

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd stitches-onboarding
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   NEXTAUTH_SECRET="your-secret-key-here"
   ENCRYPTION_KEY="your-32-character-encryption-key-here"
   # Add email and webhook settings as needed
   ```

3. **Set up the admin user**:
   ```bash
   node scripts/setup-admin.js
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Customer form: http://localhost:3000
   - Admin portal: http://localhost:3000/admin
   - Admin login: sales@pixelprint.la / Stitches123

## Database Schema

### Customers Table
```sql
customers (
  id TEXT PRIMARY KEY,
  business_name TEXT NOT NULL,
  main_email TEXT NOT NULL,
  main_contact_rep TEXT,
  phone TEXT,
  asi_number TEXT,
  business_type TEXT,
  years_in_business INTEGER,
  ein_number_encrypted TEXT,  -- AES-256 encrypted
  estimated_annual_business REAL,
  average_order_size INTEGER,
  billing_address TEXT,
  billing_city TEXT,
  billing_state TEXT,
  billing_zip TEXT,
  billing_contact TEXT,
  billing_phone TEXT,
  billing_email TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_zip TEXT,
  shipping_contact TEXT,
  shipping_phone TEXT,
  payment_method TEXT,
  payment_card_last4 TEXT,  -- Only last 4 digits
  payment_card_type TEXT,
  payment_account_last4 TEXT,  -- Only last 4 digits
  payment_account_type TEXT,
  payment_authorizations_encrypted TEXT,  -- Encrypted payment details
  signature_data TEXT,
  status TEXT DEFAULT 'pending',
  submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Admin Users Table
```sql
admin_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,  -- bcrypt hashed
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
)
```

## API Endpoints

### Public Endpoints
- `POST /api/submit-application` - Submit customer application
- `GET /api/auth/[...nextauth]` - NextAuth.js authentication

### Protected Admin Endpoints
- `GET /api/admin/submissions` - List all customer applications
- `GET /api/admin/submissions/[id]` - Get specific customer application
- `PATCH /api/admin/submissions/[id]` - Update customer status
- `GET /api/admin/export` - Export customer data (CSV/JSON)

## Security Considerations

### Payment Data Handling
- **DO NOT STORE** full credit card numbers, CVCs, or complete bank account numbers
- Only last 4 digits are stored for reference
- Full payment data is included in CSV export for immediate use
- Consider integrating with Stripe/Square for production PCI compliance

### Encryption
- EIN numbers are encrypted with AES-256
- Payment authorization data is encrypted
- Use strong, unique encryption keys in production
- Rotate encryption keys periodically

### Environment Variables
- Never commit `.env` files to version control
- Use strong, unique values for `NEXTAUTH_SECRET` and `ENCRYPTION_KEY`
- Configure proper SMTP settings for email notifications
- Set up webhook URLs for external system integration

## Deployment

### Local Development
The application runs on SQLite for easy local development. All data is stored in `stitches.db`.

### Production Deployment (AWS)

1. **Database Setup**:
   - Set up AWS RDS PostgreSQL instance
   - Update `DATABASE_URL` in environment variables
   - Run database migrations

2. **Environment Configuration**:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   NEXTAUTH_SECRET="production-secret-key"
   NEXTAUTH_URL="https://your-domain.com"
   ENCRYPTION_KEY="production-encryption-key"
   ```

3. **Deployment Options**:
   - **AWS Amplify**: Connect GitHub repository for automatic deployments
   - **AWS EC2**: Deploy as Node.js application
   - **AWS ECS**: Containerized deployment
   - **Vercel**: Easy Next.js deployment with database integration

### Database Migration (SQLite to PostgreSQL)

1. Export data from SQLite:
   ```bash
   sqlite3 stitches.db .dump > export.sql
   ```

2. Convert SQLite schema to PostgreSQL:
   - Update data types (TEXT → VARCHAR, INTEGER → INTEGER, etc.)
   - Remove SQLite-specific syntax
   - Add PostgreSQL-specific features as needed

3. Import to PostgreSQL:
   ```bash
   psql -d your_database -f converted_export.sql
   ```

## Field Mapping for Integration

### Customer Data Structure
```json
{
  "id": "uuid",
  "businessInfo": {
    "businessName": "string",
    "mainEmail": "string",
    "mainContactRep": "string",
    "phone": "string",
    "asiNumber": "string",
    "businessType": "Corp.|Partnership|Sole Prop.|LLC.|NA",
    "yearsInBusiness": "number",
    "einNumber": "string",
    "estimatedAnnualBusiness": "number",
    "averageOrderSize": "number"
  },
  "billingInfo": {
    "billingAddress": "string",
    "billingCity": "string",
    "billingState": "string",
    "billingZip": "string",
    "billingContact": "string",
    "billingPhone": "string",
    "billingEmail": "string"
  },
  "shippingInfo": {
    "shippingAddress": "string",
    "shippingCity": "string",
    "shippingState": "string",
    "shippingZip": "string",
    "shippingContact": "string",
    "shippingPhone": "string"
  },
  "paymentMethod": "ACH|CC|NET15",
  "paymentDetails": {
    // ACH: accountHolderName, accountType, routingNumber, accountNumber
    // CC/NET15: cardholderName, cardType, cardNumber, expirationDate, cvcNumber, billingZipCode
  },
  "signature": "base64-encoded-signature",
  "status": "pending|approved|rejected",
  "submissionDate": "ISO-date-string"
}
```

## Webhook Integration

Configure webhook URL in environment variables to receive notifications when new applications are submitted:

```json
{
  "event": "customer_application_submitted",
  "customerId": "uuid",
  "timestamp": "2025-01-29T20:00:00.000Z",
  "businessName": "Example Business",
  "email": "contact@example.com",
  "paymentMethod": "ACH"
}
```

## Support

For technical support or questions about this onboarding system:

- **Email**: Info@StitchesClothingCo.com
- **Phone**: (775) 355-9161
- **Address**: 990 Spice Island Dr., Sparks, NV 89431

## License

This software is proprietary to Stitches Clothing Co. All rights reserved.