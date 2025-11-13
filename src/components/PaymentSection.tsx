'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react';
import { UseFormRegister, UseFormWatch, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Application } from '@/lib/validation';

interface PaymentSectionProps {
  register: UseFormRegister<Application>;
  watch: UseFormWatch<Application>;
  errors: FieldErrors<Application>;
  setValue?: UseFormSetValue<Application>;
}

export default function PaymentSection({ register, watch, errors, setValue }: PaymentSectionProps) {
  const paymentMethod = watch('paymentMethod');
  const expirationDateInputRef = useRef<HTMLInputElement>(null);
  const cvcInputRef = useRef<HTMLInputElement>(null);

  const handleExpirationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
    
    // Limit to 4 digits
    if (value.length > 4) {
      value = value.substring(0, 4);
    }
    
    // Format with "/" after 2 digits (but allow user to type without it)
    let formattedValue = value;
    if (value.length >= 2) {
      formattedValue = value.substring(0, 2) + '/' + value.substring(2);
    }
    
    // Update the input value directly to show the formatted version
    e.target.value = formattedValue;
    
    // Update the form value
    if (setValue) {
      setValue('paymentDetails.expirationDate' as any, formattedValue, { shouldValidate: true });
    }
    
    // Auto-advance to CVC field when 4 digits are entered
    if (value.length === 4 && cvcInputRef.current) {
      setTimeout(() => {
        cvcInputRef.current?.focus();
      }, 0);
    }
  };

  const handleExpirationDateBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Normalize the value on blur to ensure it's in MM/YY format
    const value = e.target.value.replace(/\D/g, '');
    if (value.length === 4) {
      const formattedValue = value.substring(0, 2) + '/' + value.substring(2);
      e.target.value = formattedValue;
      if (setValue) {
        setValue('paymentDetails.expirationDate' as any, formattedValue, { shouldValidate: true });
      }
    }
  };

  const handleExpirationDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
        <div className="space-y-2">
          {['ACH', 'CC', 'NET15'].map((method) => (
            <div key={method}>
              <label className="flex items-center">
                <input
                  type="radio"
                  value={method}
                  {...register('paymentMethod')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-900">
                  {method === 'ACH' && 'ACH Payments'}
                  {method === 'CC' && 'Auto CC Charge'}
                  {method === 'NET15' && 'Net 15'}
                </span>
              </label>
              {method === 'ACH' && (
                <p className="text-xs text-gray-600 ml-6 mt-1">
                  ACH payments are processed the same day your order ships.
                </p>
              )}
              {method === 'NET15' && (
                <p className="text-xs text-gray-600 ml-6 mt-1">
                  Please mail us a check within 15 days.
                </p>
              )}
            </div>
          ))}
        </div>
        {errors.paymentMethod && (
          <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>
        )}
      </div>

      {/* ACH Payment Fields */}
      {paymentMethod === 'ACH' && (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h4 className="text-md font-semibold text-gray-900 mb-4">ACH Payment Information</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Holder Name *
              </label>
              <input
                type="text"
                {...register('paymentDetails.accountHolderName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
              />
              {(errors.paymentDetails as any)?.accountHolderName && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors.paymentDetails as any).accountHolderName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type *
              </label>
              <div className="space-y-2">
                {['CHECKING', 'SAVINGS'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      value={type}
                      {...register('paymentDetails.accountType')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-900">{type}</span>
                  </label>
                ))}
              </div>
              {(errors.paymentDetails as any)?.accountType && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors.paymentDetails as any).accountType.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Routing Number *
              </label>
              <input
                type="text"
                {...register('paymentDetails.routingNumber')}
                placeholder="9 digits"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
              />
              {(errors.paymentDetails as any)?.routingNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors.paymentDetails as any).routingNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number *
              </label>
              <input
                type="text"
                {...register('paymentDetails.accountNumber')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
              />
              {(errors.paymentDetails as any)?.accountNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors.paymentDetails as any).accountNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* ACH Authorizations */}
          <div className="mt-6 space-y-3">
            <h5 className="font-medium text-gray-900">Authorization (Please initial each line):</h5>
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-start">
                <input
                  type="checkbox"
                  {...register(`paymentDetails.authorization${num}` as any)}
                  className="mt-1 mr-2"
                />
                <span className="text-sm text-gray-700">
                  {num === 1 && "This Authorization is governed by the TERMS AND CONDITIONS OF SALE as provided on the Stitches Clothing Co. Terms and Conditions of Sale page of the current Contract Client Packet. I hereby agree to the TERMS AND CONDITIONS OF SALE."}
                  {num === 2 && "I certify that I am the authorized holder and signer of the bank account referenced above and that I have legal authority to enter into this Authorization on behalf of the Business referenced above. I certify that all information above is complete and accurate."}
                  {num === 3 && "I authorize Stitches Clothing Co to pull funds from the above identified bank account for my Order(s) as completed and in accordance with the TERMS AND CONDITIONS OF SALE."}
                </span>
              </div>
            ))}
          </div>

          {/* Backup Credit Card Section */}
          <div className="mt-8 pt-6 border-t border-gray-300">
            <h4 className="text-md font-semibold text-gray-900 mb-4">Backup Credit Card Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  {...register('paymentDetails.backupCardholderName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {(errors.paymentDetails as any)?.backupCardholderName && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors.paymentDetails as any).backupCardholderName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['VISA', 'MC', 'AMEX', 'DISCOVER', 'OTHER'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        value={type}
                        {...register('paymentDetails.backupCardType')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-900">{type}</span>
                    </label>
                  ))}
                </div>
                {(errors.paymentDetails as any)?.backupCardType && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors.paymentDetails as any).backupCardType.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number *
                </label>
                <input
                  type="text"
                  {...register('paymentDetails.backupCardNumber')}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {(errors.paymentDetails as any)?.backupCardNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors.paymentDetails as any).backupCardNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date *
                </label>
                <input
                  type="text"
                  {...register('paymentDetails.backupExpirationDate')}
                  placeholder="MM/YY or MMYY"
                  maxLength={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {(errors.paymentDetails as any)?.backupExpirationDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors.paymentDetails as any).backupExpirationDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVC Number *
                </label>
                <input
                  type="text"
                  {...register('paymentDetails.backupCvcNumber')}
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {(errors.paymentDetails as any)?.backupCvcNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors.paymentDetails as any).backupCvcNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Zip Code *
                </label>
                <input
                  type="text"
                  {...register('paymentDetails.backupBillingZipCode')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {(errors.paymentDetails as any)?.backupBillingZipCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors.paymentDetails as any).backupBillingZipCode.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Credit Card Payment Fields */}
      {(paymentMethod === 'CC' || paymentMethod === 'NET15') && (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            {paymentMethod === 'CC' ? 'Credit Card Payment Information' : 'Net 15 Backup Credit Card Information'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name *
              </label>
              <input
                type="text"
                {...register('paymentDetails.cardholderName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
              />
              {(errors.paymentDetails as any)?.cardholderName && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors.paymentDetails as any).cardholderName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['VISA', 'MC', 'AMEX', 'DISCOVER', 'OTHER'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      value={type}
                      {...register('paymentDetails.cardType')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-900">{type}</span>
                  </label>
                ))}
              </div>
              {(errors.paymentDetails as any)?.cardType && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors.paymentDetails as any).cardType.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number *
              </label>
              <input
                type="text"
                {...register('paymentDetails.cardNumber')}
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
              />
              {(errors.paymentDetails as any)?.cardNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors.paymentDetails as any).cardNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date *
              </label>
              <input
                type="text"
                {...register('paymentDetails.expirationDate')}
                ref={(e) => {
                  if (e) {
                    expirationDateInputRef.current = e;
                    register('paymentDetails.expirationDate').ref(e);
                  }
                }}
                onChange={(e) => {
                  handleExpirationDateChange(e);
                  register('paymentDetails.expirationDate').onChange(e);
                }}
                onBlur={(e) => {
                  handleExpirationDateBlur(e);
                  register('paymentDetails.expirationDate').onBlur(e);
                }}
                onKeyDown={handleExpirationDateKeyDown}
                placeholder="MM/YY or MMYY"
                maxLength={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
              />
              {(errors.paymentDetails as any)?.expirationDate && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors.paymentDetails as any).expirationDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVC Number *
              </label>
              <input
                type="text"
                {...register('paymentDetails.cvcNumber')}
                ref={(e) => {
                  if (e) {
                    cvcInputRef.current = e;
                    register('paymentDetails.cvcNumber').ref(e);
                  }
                }}
                placeholder="123"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
              />
              {(errors.paymentDetails as any)?.cvcNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors.paymentDetails as any).cvcNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Zip Code *
              </label>
              <input
                type="text"
                {...register('paymentDetails.billingZipCode')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
              />
              {(errors.paymentDetails as any)?.billingZipCode && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors.paymentDetails as any).billingZipCode.message}
                </p>
              )}
            </div>
          </div>

          {/* Credit Card Authorizations */}
          <div className="mt-6 space-y-3">
            <h5 className="font-medium text-gray-900">Authorization (Please initial each line):</h5>
            {paymentMethod === 'CC' ? (
              <>
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="flex items-start">
                    <input
                      type="checkbox"
                      {...register(`paymentDetails.authorization${num}` as any)}
                      className="mt-1 mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      {num === 1 && "This Authorization is governed by the TERMS AND CONDITIONS OF SALE as provided on the Stitches Clothing Co. Terms and Conditions of Sale page of the Contract Client Packet. I hereby agree to the TERMS AND CONDITIONS OF SALE."}
                      {num === 2 && "I certify that I am the authorized holder and signer of the credit card referenced above and that I have legal authority to enter into this Authorization on behalf of the Business referenced above. I certify that all information above is complete and accurate."}
                      {num === 3 && "I authorize Stitches Clothing Co LLC to charge the above identified credit card for my Order(s) as completed and in accordance with the TERMS AND CONDITIONS OF SALE."}
                      {num === 4 && "I understand that a 3% credit card processing fee will apply to all orders invoiced and charged under Automatic Payment Terms."}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <>
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="flex items-start">
                    <input
                      type="checkbox"
                      {...register(`paymentDetails.authorization${num}` as any)}
                      className="mt-1 mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      {num === 1 && "This Application is governed by the TERMS AND CONDITIONS OF SALE as provided on the Stitches Clothing Co. Terms and Conditions of Sale page of the Contract Client Packet. I hereby agree to the TERMS AND CONDITIONS OF SALE."}
                      {num === 2 && "I certify that I am the authorized holder and signer of the credit card referenced above and that I have legal authority to enter into this Authorization on behalf of the Business referenced above. I certify that all information above is complete and accurate."}
                      {num === 3 && "I hereby authorize Stitches Clothing Co to charge my card for any unpaid invoices on the sixteenth (16th) day after a job has been completed, plus the 1.5% late fee as stated in the TERMS AND CONDITIONS OF SALE."}
                      {num === 4 && "I understand a three percent (3%) processing fee will be applied to my total. I hereby agree to the same."}
                      {num === 5 && "I understand that it is my responsibility to know the terms of my Order. I understand I will not receive any further notice of Stitches Clothing Co LLC processing my credit card as agreed to herein."}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
