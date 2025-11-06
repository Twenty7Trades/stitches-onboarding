import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Application } from './validation';
import { getLast4Digits } from './encryption';

export async function generatePDFBuffer(
  application: Application,
  maskPayment: boolean = true
): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // LETTER size (8.5 x 11 inches)
    
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    let yPosition = 742; // Start near top (792 - 50 margin)
    const leftMargin = 50;
    const rightMargin = 306;
    const columnWidth = 256;
    const lineHeight = 14;
    const fontSize = 11;
    const headerFontSize = 14;
    const titleFontSize = 24;
    
    // Header - Center text manually
    const titleText = 'Contract Client Application 2025';
    const titleWidth = helveticaBoldFont.widthOfTextAtSize(titleText, titleFontSize);
    page.drawText(titleText, {
      x: (612 - titleWidth) / 2,
      y: yPosition,
      size: titleFontSize,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 25;
    
    const submittedText = `Submitted: ${new Date().toLocaleString()}`;
    const submittedWidth = helveticaFont.widthOfTextAtSize(submittedText, 12);
    page.drawText(submittedText, {
      x: (612 - submittedWidth) / 2,
      y: yPosition,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 40;
    
    // Helper function to draw text with wrapping
    const drawText = (text: string, x: number, y: number, options: { size?: number; bold?: boolean; width?: number } = {}) => {
      const size = options.size || fontSize;
      const font = options.bold ? helveticaBoldFont : helveticaFont;
      const width = options.width || columnWidth;
      
      page.drawText(text, {
        x,
        y,
        size,
        font,
        color: rgb(0, 0, 0),
        maxWidth: width,
      });
    };
    
    // Left Column - Business Information
    let leftY = yPosition;
    drawText('Business Information', leftMargin, leftY, { size: headerFontSize, bold: true });
    leftY -= lineHeight * 1.5;
    
    drawText(`Business Name: ${application.businessInfo.businessName}`, leftMargin, leftY);
    leftY -= lineHeight;
    
    drawText(`Main Email: ${application.businessInfo.mainEmail}`, leftMargin, leftY);
    leftY -= lineHeight;
    
    drawText(`Contact Rep: ${application.businessInfo.mainContactRep}`, leftMargin, leftY);
    leftY -= lineHeight;
    
    drawText(`Phone: ${application.businessInfo.phone}`, leftMargin, leftY);
    leftY -= lineHeight;
    
    if (application.businessInfo.asiNumber) {
      drawText(`ASI/PPAI/SAGE #: ${application.businessInfo.asiNumber}`, leftMargin, leftY);
      leftY -= lineHeight;
    }
    
    drawText(`Business Type: ${application.businessInfo.businessType}`, leftMargin, leftY);
    leftY -= lineHeight;
    
    drawText(`Years in Business: ${application.businessInfo.yearsInBusiness}`, leftMargin, leftY);
    leftY -= lineHeight;
    
    drawText(`EIN Number: ${application.businessInfo.einNumber}`, leftMargin, leftY);
    leftY -= lineHeight;
    
    drawText(`Estimated Annual Business: $${application.businessInfo.estimatedAnnualBusiness.toLocaleString()}`, leftMargin, leftY);
    leftY -= lineHeight;
    
    drawText(`Average Order Size: ${application.businessInfo.averageOrderSize} pieces`, leftMargin, leftY);
    leftY -= lineHeight * 2;
    
    // Left Column - Billing Information
    drawText('Billing Information', leftMargin, leftY, { size: headerFontSize, bold: true });
    leftY -= lineHeight * 1.5;
    
    drawText(`Address: ${application.billingInfo.billingAddress}`, leftMargin, leftY);
    leftY -= lineHeight;
    
    drawText(`${application.billingInfo.billingCity}, ${application.billingInfo.billingState} ${application.billingInfo.billingZip}`, leftMargin, leftY);
    leftY -= lineHeight;
    
    drawText(`Contact: ${application.billingInfo.billingContact}`, leftMargin, leftY);
    leftY -= lineHeight;
    
    drawText(`Phone: ${application.billingInfo.billingPhone}`, leftMargin, leftY);
    leftY -= lineHeight;
    
    drawText(`Email: ${application.billingInfo.billingEmail}`, leftMargin, leftY);
    
    // Right Column - Shipping Information
    let rightY = yPosition;
    drawText('Shipping Information', rightMargin, rightY, { size: headerFontSize, bold: true });
    rightY -= lineHeight * 1.5;
    
    drawText(`Address: ${application.shippingInfo.shippingAddress}`, rightMargin, rightY);
    rightY -= lineHeight;
    
    drawText(`${application.shippingInfo.shippingCity}, ${application.shippingInfo.shippingState} ${application.shippingInfo.shippingZip}`, rightMargin, rightY);
    rightY -= lineHeight;
    
    drawText(`Contact: ${application.shippingInfo.shippingContact}`, rightMargin, rightY);
    rightY -= lineHeight;
    
    drawText(`Phone: ${application.shippingInfo.shippingPhone}`, rightMargin, rightY);
    rightY -= lineHeight * 2;
    
    // Right Column - Payment Information
    drawText('Payment Information', rightMargin, rightY, { size: headerFontSize, bold: true });
    rightY -= lineHeight * 1.5;
    
    drawText(`Payment Method: ${application.paymentMethod}`, rightMargin, rightY);
    rightY -= lineHeight;
    
    if (application.paymentMethod === 'ACH') {
      const achDetails = application.paymentDetails as {
        accountHolderName: string;
        accountType: string;
        routingNumber: string;
        accountNumber: string;
      };
      
      drawText(`Account Holder: ${achDetails.accountHolderName}`, rightMargin, rightY);
      rightY -= lineHeight;
      
      drawText(`Account Type: ${achDetails.accountType}`, rightMargin, rightY);
      rightY -= lineHeight;
      
      drawText(`Routing Number: ${achDetails.routingNumber}`, rightMargin, rightY);
      rightY -= lineHeight;
      
      const accountDisplay = maskPayment
        ? `****${getLast4Digits(achDetails.accountNumber)}`
        : achDetails.accountNumber;
      drawText(`Account Number: ${accountDisplay}`, rightMargin, rightY);
    } else if (application.paymentMethod === 'CC' || application.paymentMethod === 'NET15') {
      const ccDetails = application.paymentDetails as {
        cardholderName: string;
        cardType: string;
        cardNumber: string;
        expirationDate: string;
        cvcNumber: string;
        billingZipCode: string;
      };
      
      drawText(`Cardholder Name: ${ccDetails.cardholderName}`, rightMargin, rightY);
      rightY -= lineHeight;
      
      drawText(`Card Type: ${ccDetails.cardType}`, rightMargin, rightY);
      rightY -= lineHeight;
      
      const cardDisplay = maskPayment
        ? `**** **** **** ${getLast4Digits(ccDetails.cardNumber)}`
        : ccDetails.cardNumber;
      drawText(`Card Number: ${cardDisplay}`, rightMargin, rightY);
      rightY -= lineHeight;
      
      drawText(`Expiration: ${ccDetails.expirationDate}`, rightMargin, rightY);
      rightY -= lineHeight;
      
      const cvcDisplay = maskPayment ? '***' : ccDetails.cvcNumber;
      drawText(`CVC: ${cvcDisplay}`, rightMargin, rightY);
      rightY -= lineHeight;
      
      drawText(`Billing Zip: ${ccDetails.billingZipCode}`, rightMargin, rightY);
    }
    
    // Signature section at bottom
    const signatureY = Math.min(leftY, rightY) - 30;
    
    drawText('Digital Signature:', leftMargin, signatureY, { bold: true });
    
    // Extract and embed signature image
    try {
      const signatureData = application.signature.signature;
      if (signatureData && signatureData.startsWith('data:image')) {
        const base64Data = signatureData.split(',')[1];
        const imageBytes = Buffer.from(base64Data, 'base64');
        
        let image;
        if (signatureData.includes('image/png')) {
          image = await pdfDoc.embedPng(imageBytes);
        } else {
          image = await pdfDoc.embedJpg(imageBytes);
        }
        
        const imageDims = image.scale(0.25); // Scale down
        page.drawImage(image, {
          x: leftMargin,
          y: signatureY - 80,
          width: imageDims.width,
          height: imageDims.height,
        });
      } else {
        drawText('Signature data not available', leftMargin, signatureY - 15, { size: 10 });
      }
    } catch (error) {
      console.error('Error embedding signature:', error);
      drawText('Signature could not be embedded', leftMargin, signatureY - 15, { size: 10 });
    }
    
    // Timestamp at bottom
    const timestampY = signatureY - 100;
    const timestampText = `Generated: ${new Date().toLocaleString()}`;
    const timestampWidth = helveticaFont.widthOfTextAtSize(timestampText, 10);
    page.drawText(timestampText, {
      x: (612 - timestampWidth) / 2,
      y: timestampY,
      size: 10,
      font: helveticaFont,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}

export function maskPaymentInfo(paymentDetails: Record<string, unknown>, paymentMethod: string): string {
  if (paymentMethod === 'ACH') {
    const accountNumber = (paymentDetails.accountNumber as string) || '';
    return `****${getLast4Digits(accountNumber)}`;
  } else if (paymentMethod === 'CC' || paymentMethod === 'NET15') {
    const cardNumber = (paymentDetails.cardNumber as string) || '';
    return `**** **** **** ${getLast4Digits(cardNumber)}`;
  }
  return '****';
}
