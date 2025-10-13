'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Customer {
  id: string;
  business_name: string;
  main_email: string;
  main_contact_rep: string;
  phone: string;
  asi_number?: string;
  business_type: string;
  years_in_business: number;
  ein_number_decrypted?: string;
  estimated_annual_business: number;
  average_order_size: number;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  billing_contact: string;
  billing_phone: string;
  billing_email: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_contact: string;
  shipping_phone: string;
  payment_method: string;
  payment_card_last4?: string;
  payment_card_type?: string;
  payment_account_last4?: string;
  payment_account_type?: string;
  payment_authorizations_decrypted?: any;
  signature_data: string;
  status: string;
  submission_date: string;
  created_at: string;
  updated_at: string;
}

export default function SubmissionDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchCustomer();
    }
  }, [session, params.id]);

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`/api/admin/submissions/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customer');
      }
      const data = await response.json();
      setCustomer(data.customer);
    } catch (error) {
      setError('Failed to load customer data');
      console.error('Error fetching customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!customer) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/submissions/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setCustomer({ ...customer, status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const maskCardNumber = (cardNumber: string) => {
    if (!cardNumber || cardNumber.length < 4) return '****';
    return '**** **** **** ' + cardNumber.slice(-4);
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber || accountNumber.length < 4) return '****';
    return '****' + accountNumber.slice(-4);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !customer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Customer Application</h1>
                <p className="text-sm text-gray-600">ID: {customer.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Status:</span>
                {getStatusBadge(customer.status)}
              </div>
              <select
                value={customer.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                disabled={isUpdating}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Business Information */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Business Name</label>
                    <p className="text-sm text-gray-900">{customer.business_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Main Email</label>
                    <p className="text-sm text-gray-900">{customer.main_email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Main Contact Rep</label>
                    <p className="text-sm text-gray-900">{customer.main_contact_rep}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-sm text-gray-900">{customer.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">ASI/PPAI/SAGE #</label>
                    <p className="text-sm text-gray-900">{customer.asi_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Business Type</label>
                    <p className="text-sm text-gray-900">{customer.business_type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Years in Business</label>
                    <p className="text-sm text-gray-900">{customer.years_in_business}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">EIN Number</label>
                    <p className="text-sm text-gray-900">{customer.ein_number_decrypted || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Estimated Annual Business</label>
                    <p className="text-sm text-gray-900">${customer.estimated_annual_business.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Average Order Size</label>
                    <p className="text-sm text-gray-900">{customer.average_order_size} pieces</p>
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">Address</label>
                    <p className="text-sm text-gray-900">{customer.billing_address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">City</label>
                    <p className="text-sm text-gray-900">{customer.billing_city}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">State</label>
                    <p className="text-sm text-gray-900">{customer.billing_state}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Zip Code</label>
                    <p className="text-sm text-gray-900">{customer.billing_zip}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Contact Name</label>
                    <p className="text-sm text-gray-900">{customer.billing_contact}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-sm text-gray-900">{customer.billing_phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">Email for Invoices</label>
                    <p className="text-sm text-gray-900">{customer.billing_email}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">Address</label>
                    <p className="text-sm text-gray-900">{customer.shipping_address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">City</label>
                    <p className="text-sm text-gray-900">{customer.shipping_city}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">State</label>
                    <p className="text-sm text-gray-900">{customer.shipping_state}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Zip Code</label>
                    <p className="text-sm text-gray-900">{customer.shipping_zip}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Contact Name</label>
                    <p className="text-sm text-gray-900">{customer.shipping_contact}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-sm text-gray-900">{customer.shipping_phone}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Payment Method</label>
                    <p className="text-sm text-gray-900">{customer.payment_method}</p>
                  </div>

                  {customer.payment_authorizations_decrypted && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-md font-semibold text-gray-900 mb-2">Payment Details</h3>
                      {customer.payment_method === 'ACH' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Account Holder Name</label>
                            <p className="text-sm text-gray-900">{customer.payment_authorizations_decrypted.accountHolderName}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Account Type</label>
                            <p className="text-sm text-gray-900">{customer.payment_authorizations_decrypted.accountType}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Routing Number</label>
                            <p className="text-sm text-gray-900">{customer.payment_authorizations_decrypted.routingNumber}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Account Number</label>
                            <p className="text-sm text-gray-900">{maskAccountNumber(customer.payment_authorizations_decrypted.accountNumber)}</p>
                          </div>
                        </div>
                      )}

                      {(customer.payment_method === 'CC' || customer.payment_method === 'NET15') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Cardholder Name</label>
                            <p className="text-sm text-gray-900">{customer.payment_authorizations_decrypted.cardholderName}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Card Type</label>
                            <p className="text-sm text-gray-900">{customer.payment_authorizations_decrypted.cardType}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Card Number</label>
                            <p className="text-sm text-gray-900">{maskCardNumber(customer.payment_authorizations_decrypted.cardNumber)}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Expiration Date</label>
                            <p className="text-sm text-gray-900">{customer.payment_authorizations_decrypted.expirationDate}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">CVC Number</label>
                            <p className="text-sm text-gray-900">***</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Billing Zip Code</label>
                            <p className="text-sm text-gray-900">{customer.payment_authorizations_decrypted.billingZipCode}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Digital Signature */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Digital Signature</h2>
                {customer.signature_data && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <img
                      src={customer.signature_data}
                      alt="Customer Signature"
                      className="max-w-full h-auto"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Application Summary */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Submitted</label>
                    <p className="text-sm text-gray-900">
                      {new Date(customer.submission_date).toLocaleDateString()} at {new Date(customer.submission_date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(customer.status)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Payment Method</label>
                    <p className="text-sm text-gray-900">{customer.payment_method}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      const data = JSON.stringify(customer, null, 2);
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `customer-${customer.id}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Export JSON
                  </button>
                  <button
                    onClick={() => {
                      const csvData = [
                        ['Field', 'Value'],
                        ['Business Name', customer.business_name],
                        ['Email', customer.main_email],
                        ['Phone', customer.phone],
                        ['Payment Method', customer.payment_method],
                        ['Status', customer.status],
                        ['Submitted', customer.submission_date]
                      ];
                      const csvContent = csvData.map(row => row.join(',')).join('\n');
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `customer-${customer.id}.csv`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Export CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
