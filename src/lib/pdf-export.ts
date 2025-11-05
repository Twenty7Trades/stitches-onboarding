import PDFDocument from 'pdfkit';
import { Application } from './validation';
import { getLast4Digits } from './encryption';

export async function generatePDFBuffer(
  application: Application,
  maskPayment: boolean = true
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Header
      doc.fontSize(20).font('Helvetica-Bold')
        .text('Contract Client Application 2025', 50, 50, { align: 'center' });
      
      doc.fontSize(10).font('Helvetica')
        .text(`Submitted: ${new Date().toLocaleString()}`, 50, 75, { align: 'center' });

      // Two-column layout
      const leftX = 50;
      const rightX = 306; // Halfway point (612/2 = 306)
      const columnWidth = 256;
      let currentY = 110;

      // Left Column - Business Information
      doc.fontSize(12).font('Helvetica-Bold')
        .text('Business Information', leftX, currentY);
      currentY += 20;
      
      doc.fontSize(9).font('Helvetica')
        .text(`Business Name: ${application.businessInfo.businessName}`, leftX, currentY, {
          width: columnWidth
        });
      currentY += 12;
      
      doc.text(`Main Email: ${application.businessInfo.mainEmail}`, leftX, currentY, {
        width: columnWidth
      });
      currentY += 12;
      
      doc.text(`Contact Rep: ${application.businessInfo.mainContactRep}`, leftX, currentY, {
        width: columnWidth
      });
      currentY += 12;
      
      doc.text(`Phone: ${application.businessInfo.phone}`, leftX, currentY, {
        width: columnWidth
      });
      currentY += 12;
      
      if (application.businessInfo.asiNumber) {
        doc.text(`ASI/PPAI/SAGE #: ${application.businessInfo.asiNumber}`, leftX, currentY, {
          width: columnWidth
        });
        currentY += 12;
      }
      
      doc.text(`Business Type: ${application.businessInfo.businessType}`, leftX, currentY, {
        width: columnWidth
      });
      currentY += 12;
      
      doc.text(`Years in Business: ${application.businessInfo.yearsInBusiness}`, leftX, currentY, {
        width: columnWidth
      });
      currentY += 12;
      
      doc.text(`EIN Number: ${application.businessInfo.einNumber}`, leftX, currentY, {
        width: columnWidth
      });
      currentY += 12;
      
      doc.text(`Estimated Annual Business: $${application.businessInfo.estimatedAnnualBusiness.toLocaleString()}`, leftX, currentY, {
        width: columnWidth
      });
      currentY += 12;
      
      doc.text(`Average Order Size: ${application.businessInfo.averageOrderSize} pieces`, leftX, currentY, {
        width: columnWidth
      });
      currentY += 20;

      // Left Column - Billing Information
      doc.fontSize(12).font('Helvetica-Bold')
        .text('Billing Information', leftX, currentY);
      currentY += 20;
      
      doc.fontSize(9).font('Helvetica')
        .text(`Address: ${application.billingInfo.billingAddress}`, leftX, currentY, {
          width: columnWidth
        });
      currentY += 12;
      
      doc.text(`${application.billingInfo.billingCity}, ${application.billingInfo.billingState} ${application.billingInfo.billingZip}`, leftX, currentY, {
        width: columnWidth
      });
      currentY += 12;
      
      doc.text(`Contact: ${application.billingInfo.billingContact}`, leftX, currentY, {
        width: columnWidth
      });
      currentY += 12;
      
      doc.text(`Phone: ${application.billingInfo.billingPhone}`, leftX, currentY, {
        width: columnWidth
      });
      currentY += 12;
      
      doc.text(`Email: ${application.billingInfo.billingEmail}`, leftX, currentY, {
        width: columnWidth
      });

      // Right Column - Shipping Information
      let rightY = 110;
      doc.fontSize(12).font('Helvetica-Bold')
        .text('Shipping Information', rightX, rightY);
      rightY += 20;
      
      doc.fontSize(9).font('Helvetica')
        .text(`Address: ${application.shippingInfo.shippingAddress}`, rightX, rightY, {
          width: columnWidth
        });
      rightY += 12;
      
      doc.text(`${application.shippingInfo.shippingCity}, ${application.shippingInfo.shippingState} ${application.shippingInfo.shippingZip}`, rightX, rightY, {
        width: columnWidth
      });
      rightY += 12;
      
      doc.text(`Contact: ${application.shippingInfo.shippingContact}`, rightX, rightY, {
        width: columnWidth
      });
      rightY += 12;
      
      doc.text(`Phone: ${application.shippingInfo.shippingPhone}`, rightX, rightY, {
        width: columnWidth
      });
      rightY += 20;

      // Right Column - Payment Information
      doc.fontSize(12).font('Helvetica-Bold')
        .text('Payment Information', rightX, rightY);
      rightY += 20;
      
      doc.fontSize(9).font('Helvetica')
        .text(`Payment Method: ${application.paymentMethod}`, rightX, rightY, {
          width: columnWidth
        });
      rightY += 12;

      if (application.paymentMethod === 'ACH') {
        const achDetails = application.paymentDetails as {
          accountHolderName: string;
          accountType: string;
          routingNumber: string;
          accountNumber: string;
        };
        
        doc.text(`Account Holder: ${achDetails.accountHolderName}`, rightX, rightY, {
          width: columnWidth
        });
        rightY += 12;
        
        doc.text(`Account Type: ${achDetails.accountType}`, rightX, rightY, {
          width: columnWidth
        });
        rightY += 12;
        
        doc.text(`Routing Number: ${achDetails.routingNumber}`, rightX, rightY, {
          width: columnWidth
        });
        rightY += 12;
        
        const accountDisplay = maskPayment
          ? `****${getLast4Digits(achDetails.accountNumber)}`
          : achDetails.accountNumber;
        doc.text(`Account Number: ${accountDisplay}`, rightX, rightY, {
          width: columnWidth
        });
      } else if (application.paymentMethod === 'CC' || application.paymentMethod === 'NET15') {
        const ccDetails = application.paymentDetails as {
          cardholderName: string;
          cardType: string;
          cardNumber: string;
          expirationDate: string;
          cvcNumber: string;
          billingZipCode: string;
        };
        
        doc.text(`Cardholder Name: ${ccDetails.cardholderName}`, rightX, rightY, {
          width: columnWidth
        });
        rightY += 12;
        
        doc.text(`Card Type: ${ccDetails.cardType}`, rightX, rightY, {
          width: columnWidth
        });
        rightY += 12;
        
        const cardDisplay = maskPayment
          ? `**** **** **** ${getLast4Digits(ccDetails.cardNumber)}`
          : ccDetails.cardNumber;
        doc.text(`Card Number: ${cardDisplay}`, rightX, rightY, {
          width: columnWidth
        });
        rightY += 12;
        
        doc.text(`Expiration: ${ccDetails.expirationDate}`, rightX, rightY, {
          width: columnWidth
        });
        rightY += 12;
        
        const cvcDisplay = maskPayment ? '***' : ccDetails.cvcNumber;
        doc.text(`CVC: ${cvcDisplay}`, rightX, rightY, {
          width: columnWidth
        });
        rightY += 12;
        
        doc.text(`Billing Zip: ${ccDetails.billingZipCode}`, rightX, rightY, {
          width: columnWidth
        });
      }

      // Signature section at bottom
      let signatureY = Math.max(currentY, rightY) + 30;
      
      doc.fontSize(10).font('Helvetica-Bold')
        .text('Digital Signature:', 50, signatureY);
      
      signatureY += 20;
      
      // Extract and embed signature image
      try {
        const signatureData = application.signature.signature;
        if (signatureData && signatureData.startsWith('data:image')) {
          // Extract base64 data
          const base64Data = signatureData.split(',')[1];
          const imageBuffer = Buffer.from(base64Data, 'base64');
          
          // Determine image type
          const imageType = signatureData.includes('image/png') ? 'PNG' : 'JPEG';
          
          doc.image(imageBuffer, 50, signatureY, {
            fit: [200, 80],
            align: 'left'
          });
          
          signatureY += 90;
        } else {
          doc.fontSize(9).font('Helvetica')
            .text('Signature data not available', 50, signatureY);
          signatureY += 15;
        }
      } catch (error) {
        console.error('Error embedding signature:', error);
        doc.fontSize(9).font('Helvetica')
          .text('Signature could not be embedded', 50, signatureY);
        signatureY += 15;
      }

      // Timestamp at bottom
      doc.fontSize(8).font('Helvetica')
        .text(`Generated: ${new Date().toLocaleString()}`, 50, signatureY, {
          align: 'center',
          width: 512
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export function maskPaymentInfo(paymentDetails: any, paymentMethod: string): string {
  if (paymentMethod === 'ACH') {
    const accountNumber = paymentDetails.accountNumber || '';
    return `****${getLast4Digits(accountNumber)}`;
  } else if (paymentMethod === 'CC' || paymentMethod === 'NET15') {
    const cardNumber = paymentDetails.cardNumber || '';
    return `**** **** **** ${getLast4Digits(cardNumber)}`;
  }
  return '****';
}
