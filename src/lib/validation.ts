import { z } from 'zod';

// Business Information Schema
export const businessInfoSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  mainEmail: z.string().email('Valid email is required'),
  mainContactRep: z.string().min(1, 'Main contact rep is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  asiNumber: z.string().optional(),
  businessType: z.enum(['Corp.', 'Partnership', 'Sole Prop.', 'LLC.', 'NA'], {
    message: 'Please select a business type'
  }),
  yearsInBusiness: z.number().min(0, 'Years in business must be 0 or greater'),
  einNumber: z.string().min(9, 'EIN must be 9 digits').max(9, 'EIN must be 9 digits'),
  estimatedAnnualBusiness: z.number().min(0, 'Estimated annual business must be 0 or greater'),
  averageOrderSize: z.number().min(1, 'Average order size must be at least 1')
});

// Billing Information Schema
export const billingInfoSchema = z.object({
  billingAddress: z.string().min(1, 'Billing address is required'),
  billingCity: z.string().min(1, 'Billing city is required'),
  billingState: z.string().min(2, 'Billing state is required'),
  billingZip: z.string().min(5, 'Valid zip code is required'),
  billingContact: z.string().min(1, 'Billing contact is required'),
  billingPhone: z.string().min(10, 'Valid billing phone is required'),
  billingEmail: z.string().email('Valid billing email is required')
});

// Shipping Information Schema
export const shippingInfoSchema = z.object({
  shippingAddress: z.string().min(1, 'Shipping address is required'),
  shippingCity: z.string().min(1, 'Shipping city is required'),
  shippingState: z.string().min(2, 'Shipping state is required'),
  shippingZip: z.string().min(5, 'Valid shipping zip is required'),
  shippingContact: z.string().min(1, 'Shipping contact is required'),
  shippingPhone: z.string().min(10, 'Valid shipping phone is required')
});

// ACH Payment Schema
export const achPaymentSchema = z.object({
  accountHolderName: z.string().min(1, 'Account holder name is required'),
  accountType: z.enum(['CHECKING', 'SAVINGS'], {
    message: 'Please select account type'
  }),
  routingNumber: z.string().regex(/^\d{9}$/, 'Routing number must be 9 digits'),
  accountNumber: z.string().min(4, 'Account number is required'),
  authorization1: z.boolean().refine(val => val === true, 'Authorization required'),
  authorization2: z.boolean().refine(val => val === true, 'Authorization required'),
  authorization3: z.boolean().refine(val => val === true, 'Authorization required')
});

// Credit Card Payment Schema
export const ccPaymentSchema = z.object({
  cardholderName: z.string().min(1, 'Cardholder name is required'),
  cardType: z.enum(['VISA', 'MC', 'AMEX', 'DISCOVER', 'OTHER'], {
    message: 'Please select card type'
  }),
  cardNumber: z.string().min(13, 'Valid card number is required'),
  expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Valid expiration date (MM/YY) is required'),
  cvcNumber: z.string().min(3, 'CVC is required'),
  billingZipCode: z.string().min(5, 'Billing zip code is required'),
  authorization1: z.boolean().refine(val => val === true, 'Authorization required'),
  authorization2: z.boolean().refine(val => val === true, 'Authorization required'),
  authorization3: z.boolean().refine(val => val === true, 'Authorization required'),
  authorization4: z.boolean().refine(val => val === true, 'Authorization required')
});

// Net 15 Payment Schema
export const net15PaymentSchema = z.object({
  cardholderName: z.string().min(1, 'Cardholder name is required'),
  cardType: z.enum(['VISA', 'MC', 'AMEX', 'DISCOVER', 'OTHER'], {
    message: 'Please select card type'
  }),
  cardNumber: z.string().min(13, 'Valid card number is required'),
  expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Valid expiration date (MM/YY) is required'),
  cvcNumber: z.string().min(3, 'CVC is required'),
  billingZipCode: z.string().min(5, 'Billing zip code is required'),
  authorization1: z.boolean().refine(val => val === true, 'Authorization required'),
  authorization2: z.boolean().refine(val => val === true, 'Authorization required'),
  authorization3: z.boolean().refine(val => val === true, 'Authorization required'),
  authorization4: z.boolean().refine(val => val === true, 'Authorization required'),
  authorization5: z.boolean().refine(val => val === true, 'Authorization required')
});

// Payment Method Selection Schema
export const paymentMethodSchema = z.enum(['ACH', 'CC', 'NET15'], {
  message: 'Please select a payment method'
});

// Signature Schema
export const signatureSchema = z.object({
  signature: z.string().min(1, 'Digital signature is required')
});

// Complete Application Schema
export const applicationSchema = z.object({
  businessInfo: businessInfoSchema,
  billingInfo: billingInfoSchema,
  shippingInfo: shippingInfoSchema,
  paymentMethod: paymentMethodSchema,
  paymentDetails: z.union([achPaymentSchema, ccPaymentSchema, net15PaymentSchema]),
  signature: signatureSchema
});

// Admin Login Schema
export const adminLoginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required')
});

// Validation helper functions
export function validateCardNumber(cardNumber: string): boolean {
  // Luhn algorithm
  const num = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;
  
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

export function validateRoutingNumber(routingNumber: string): boolean {
  // Basic routing number validation
  const num = routingNumber.replace(/\D/g, '');
  if (num.length !== 9) return false;
  
  // Check digit algorithm for routing numbers
  const digits = num.split('').map(Number);
  const checkSum = (3 * (digits[0] + digits[3] + digits[6]) +
                   7 * (digits[1] + digits[4] + digits[7]) +
                   1 * (digits[2] + digits[5] + digits[8])) % 10;
  
  return checkSum === 0;
}

export type BusinessInfo = z.infer<typeof businessInfoSchema>;
export type BillingInfo = z.infer<typeof billingInfoSchema>;
export type ShippingInfo = z.infer<typeof shippingInfoSchema>;
export type AchPayment = z.infer<typeof achPaymentSchema>;
export type CcPayment = z.infer<typeof ccPaymentSchema>;
export type Net15Payment = z.infer<typeof net15PaymentSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type Signature = z.infer<typeof signatureSchema>;
export type Application = z.infer<typeof applicationSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;
