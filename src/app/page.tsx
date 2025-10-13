'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ApplicationForm from '@/components/ApplicationForm';
import { Application } from '@/lib/validation';

export default function HomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [csvDownloadUrl, setCsvDownloadUrl] = useState<string | null>(null);

  const handleSubmit = async (data: Application) => {
    setIsSubmitting(true);
    
    try {
      // Ensure the data structure matches what the API expects
      const submissionData = {
        businessInfo: data.businessInfo,
        billingInfo: data.billingInfo,
        shippingInfo: data.shippingInfo,
        paymentMethod: data.paymentMethod,
        paymentDetails: data.paymentDetails,
        signature: data.signature
      };

      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const result = await response.json();
      
      // Create download URL for CSV
      const blob = new Blob([result.csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      setCsvDownloadUrl(url);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Thank you for your application. We have received your information and will review it shortly.
            </p>

            {csvDownloadUrl && (
              <div className="mb-6">
                <a
                  href={csvDownloadUrl}
                  download="stitches-application.csv"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Application CSV
                </a>
              </div>
            )}

            <div className="text-sm text-gray-500">
              <p>You will receive a confirmation email shortly.</p>
              <p>If you have any questions, please contact us at (775) 355-9161</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <img 
                  src="/stitches-logo.webp" 
                  alt="Stitches Clothing Co Logo" 
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link
                href="/terms"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/pricing-details"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Pricing Details
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Contract Client Application 2025
            </h1>
            <p className="text-lg text-gray-600">
              Required for all Clients
            </p>
          </div>

          <ApplicationForm onSubmit={handleSubmit} isLoading={isSubmitting} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Stitches Clothing Co</h3>
            <p className="text-gray-600 mb-2">Custom Screen Printing</p>
            <p className="text-gray-600 mb-2">990 Spice Island Dr., Sparks, NV 89431</p>
            <p className="text-gray-600">
              (775) 355-9161 • <a href="mailto:Info@StitchesClothingCo.com" className="text-blue-600 hover:text-blue-800">Info@StitchesClothingCo.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}