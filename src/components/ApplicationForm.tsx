'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicationSchema, Application } from '@/lib/validation';
import PaymentSection from './PaymentSection';
import SignatureCanvasComponent from './SignatureCanvas';

interface ApplicationFormProps {
  onSubmit: (data: Application) => Promise<void>;
  isLoading?: boolean;
}

export default function ApplicationForm({ onSubmit, isLoading }: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [signature, setSignature] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger
  } = useForm<Application>({
    resolver: zodResolver(applicationSchema),
    mode: 'onChange'
  });

  const totalSteps = 5;

  const nextStep = async () => {
    setValidationErrors([]);
    let isValid = false;
    const errorMessages: string[] = [];
    
    switch (currentStep) {
      case 1:
        isValid = await trigger('businessInfo');
        if (!isValid) {
          errorMessages.push('Please complete all required business information fields');
        }
        break;
      case 2:
        isValid = await trigger('billingInfo');
        if (!isValid) {
          errorMessages.push('Please complete all required billing information fields');
        }
        break;
      case 3:
        isValid = await trigger('shippingInfo');
        if (!isValid) {
          errorMessages.push('Please complete all required shipping information fields');
        }
        break;
      case 4:
        isValid = await trigger(['paymentMethod', 'paymentDetails']);
        if (!isValid) {
          errorMessages.push('Please complete all required payment information fields');
        }
        break;
      case 5:
        isValid = signature.length > 0;
        if (!isValid) {
          errorMessages.push('Please provide your digital signature');
        }
        break;
    }

    if (!isValid) {
      setValidationErrors(errorMessages);
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onFormSubmit = async (data: Application) => {
    setValidationErrors([]);
    
    if (signature.length === 0) {
      setValidationErrors(['Please provide your digital signature']);
      return;
    }
    
    try {
      const formData = {
        ...data,
        signature: { signature }
      };
      
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      setValidationErrors(['There was an error submitting your application. Please try again.']);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        {/* Validation Error Display */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <ul className="list-disc list-inside">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Business Information */}
        {currentStep === 1 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  {...register('businessInfo.businessName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.businessInfo?.businessName && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessInfo.businessName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Email Address *
                </label>
                <input
                  type="email"
                  {...register('businessInfo.mainEmail')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.businessInfo?.mainEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessInfo.mainEmail.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Contact Rep *
                </label>
                <input
                  type="text"
                  {...register('businessInfo.mainContactRep')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.businessInfo?.mainContactRep && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessInfo.mainContactRep.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  {...register('businessInfo.phone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.businessInfo?.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessInfo.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ASI/PPAI/SAGE # (if applicable)
                </label>
                <input
                  type="text"
                  {...register('businessInfo.asiNumber')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Corp.', 'Partnership', 'Sole Prop.', 'LLC.'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        value={type}
                        {...register('businessInfo.businessType')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-900">{type}</span>
                    </label>
                  ))}
                </div>
                {errors.businessInfo?.businessType && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessInfo.businessType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years in Business *
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('businessInfo.yearsInBusiness', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.businessInfo?.yearsInBusiness && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessInfo.yearsInBusiness.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  EIN Number *
                </label>
                <input
                  type="text"
                  {...register('businessInfo.einNumber')}
                  placeholder="XX-XXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.businessInfo?.einNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessInfo.einNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Annual Business with Us *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    {...register('businessInfo.estimatedAnnualBusiness', { valueAsNumber: true })}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                  />
                </div>
                {errors.businessInfo?.estimatedAnnualBusiness && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessInfo.estimatedAnnualBusiness.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Quantity of Shirts Per Order *
                </label>
                <input
                  type="number"
                  min="1"
                  {...register('businessInfo.averageOrderSize', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.businessInfo?.averageOrderSize && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessInfo.averageOrderSize.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Billing Information */}
        {currentStep === 2 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Address *
                </label>
                <input
                  type="text"
                  {...register('billingInfo.billingAddress')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.billingInfo?.billingAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.billingInfo.billingAddress.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  {...register('billingInfo.billingCity')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.billingInfo?.billingCity && (
                  <p className="text-red-500 text-sm mt-1">{errors.billingInfo.billingCity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  {...register('billingInfo.billingState')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.billingInfo?.billingState && (
                  <p className="text-red-500 text-sm mt-1">{errors.billingInfo.billingState.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code *
                </label>
                <input
                  type="text"
                  {...register('billingInfo.billingZip')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.billingInfo?.billingZip && (
                  <p className="text-red-500 text-sm mt-1">{errors.billingInfo.billingZip.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name *
                </label>
                <input
                  type="text"
                  {...register('billingInfo.billingContact')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.billingInfo?.billingContact && (
                  <p className="text-red-500 text-sm mt-1">{errors.billingInfo.billingContact.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  {...register('billingInfo.billingPhone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.billingInfo?.billingPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.billingInfo.billingPhone.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email for Invoices *
                </label>
                <input
                  type="email"
                  {...register('billingInfo.billingEmail')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.billingInfo?.billingEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.billingInfo.billingEmail.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Shipping Information */}
        {currentStep === 3 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Address *
                </label>
                <input
                  type="text"
                  {...register('shippingInfo.shippingAddress')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.shippingInfo?.shippingAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.shippingInfo.shippingAddress.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  {...register('shippingInfo.shippingCity')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.shippingInfo?.shippingCity && (
                  <p className="text-red-500 text-sm mt-1">{errors.shippingInfo.shippingCity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  {...register('shippingInfo.shippingState')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.shippingInfo?.shippingState && (
                  <p className="text-red-500 text-sm mt-1">{errors.shippingInfo.shippingState.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code *
                </label>
                <input
                  type="text"
                  {...register('shippingInfo.shippingZip')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.shippingInfo?.shippingZip && (
                  <p className="text-red-500 text-sm mt-1">{errors.shippingInfo.shippingZip.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name *
                </label>
                <input
                  type="text"
                  {...register('shippingInfo.shippingContact')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.shippingInfo?.shippingContact && (
                  <p className="text-red-500 text-sm mt-1">{errors.shippingInfo.shippingContact.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  {...register('shippingInfo.shippingPhone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                />
                {errors.shippingInfo?.shippingPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.shippingInfo.shippingPhone.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Payment Method */}
        {currentStep === 4 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <PaymentSection register={register} watch={watch} errors={errors} />
          </div>
        )}

        {/* Step 5: Signature */}
        {currentStep === 5 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Digital Signature</h2>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>By signing below I am stating that I have read and I agree to all of the policies stated in the Stitches Contract Client Packet for 2024 and the Terms and Conditions included herein on the Stitches Clothing Co., Terms and Conditions of Sale page of the Contract Client Packet 2024.</strong>
              </p>
              <p className="text-sm text-gray-700 mt-2">
                I am taking responsibility for this application for my entire company, including all reps who may use our Stitches Clothing Co account. I certify that I am the authorized individual to enter into this agreement on behalf of my company and that I have legal authority to bind the company to the agreement&apos;s terms and conditions. I certify that all information above is complete and accurate.
              </p>
            </div>

            <SignatureCanvasComponent
              onSignatureChange={setSignature}
              value={signature}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading || signature.length === 0}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
