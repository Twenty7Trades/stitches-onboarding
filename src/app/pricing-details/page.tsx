'use client';

import React from 'react';
import Navigation from '@/components/Navigation';

export default function PricingDetailsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navigation 
        links={[
          { href: '/', label: 'Application' },
          { href: '/terms', label: 'Terms & Conditions' },
        ]}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Pricing Details
            </h1>
            <a
              href="/Pricing-Details.pdf"
              download
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </a>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Production Timeline</h2>
              <div className="space-y-3 text-blue-800">
                <p className="text-lg"><strong>Standard Production Time:</strong> 7-10 business days</p>
                <p className="text-lg"><strong>Rush Services:</strong> Available upon approval</p>
                <p className="text-sm italic border-t border-blue-200 pt-3">
                  *Turnaround time is subject to increase without notice during peak seasons
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contract Client Printing Rates - 2025</h2>

            {/* Printing on Darks */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Printing on Darks (Underbase Included)</h3>
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">Qty</th>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">1 Color</th>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">2 Colors</th>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">3 Colors</th>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">4 Colors</th>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">5 Colors</th>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">6 Colors</th>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">7 Colors</th>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">8 Colors</th>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">Per Add Color</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">48-71</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.88</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.45</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$3.18</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$4.14</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$4.96</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$5.46</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$6.01</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$6.61</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.20</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">72-143</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.51</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.96</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.54</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$3.31</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$3.97</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$4.37</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$4.81</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$5.29</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.20</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">144-287</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.21</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.56</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.04</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.65</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$3.18</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$3.50</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$3.85</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$4.22</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.15</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">288-431</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.97</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.25</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.63</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.12</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.54</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.79</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$3.08</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$3.39</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.15</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">432-575</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.77</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.00</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.31</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.69</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.04</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.23</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.46</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.71</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.15</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">576-999</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.66</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.85</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.11</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.44</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.73</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.90</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.09</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.30</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.15</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">1000-2499</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.63</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.81</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.06</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.16</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.28</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.40</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.54</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.69</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.10</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">2500-4999</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.55</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.63</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.73</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.80</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.88</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.97</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.06</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.17</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.10</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">5000-7499</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.50</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.54</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.60</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.66</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.72</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.80</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.88</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.96</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.10</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">7500-9999</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.45</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.50</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.55</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.60</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.66</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.73</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.80</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.88</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.10</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-gray-50 text-sm text-gray-600">
                  <p>*10k+ quantity, email for special pricing</p>
                  <p>*Orders under 48 pieces must be approved by SCC prior to being submitted</p>
                  <p className="font-semibold text-green-600">NO SCREEN FEES</p>
                </div>
              </div>
            </div>

            {/* Printing on Lights */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Printing on Lights (NO Underbase Included)</h3>
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">Qty</th>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">1 Color</th>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">2 Colors</th>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">3 Colors</th>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">4 Colors</th>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">5 Colors</th>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">6 Colors</th>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">7 Colors</th>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">8 Colors</th>
                        <th className="px-2 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300 text-center">Per Add Color</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">48-71</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.71</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.23</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.89</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$3.76</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$4.51</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$4.96</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$5.46</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$6.01</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.20</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">72-143</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.37</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.78</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.31</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$3.01</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$3.61</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$3.97</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$4.37</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$4.81</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.20</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">144-287</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.10</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.42</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.85</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.41</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.89</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$3.18</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$3.50</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$3.84</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.15</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">288-431</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.88</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.14</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.48</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.93</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.31</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.54</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.80</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$3.08</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.15</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">432-575</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.70</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.91</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.19</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.54</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.85</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.03</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.24</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.46</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.15</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">576-999</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.60</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.77</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.01</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.31</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.57</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.73</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.90</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$2.09</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.15</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">1000-2499</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.57</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.74</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.96</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.05</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.16</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.27</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.40</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.54</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.10</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">2500-4999</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.50</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.58</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.66</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.73</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.80</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.88</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.97</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$1.06</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.10</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">5000-7499</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.45</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.50</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.54</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.60</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.66</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.72</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.80</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.88</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.10</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">7500-9999</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.41</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.45</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.50</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.55</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.60</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.66</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.73</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.80</td>
                        <td className="px-2 py-2 text-xs text-center font-bold text-blue-600">$0.10</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-gray-50 text-sm text-gray-600">
                  <p>*10k+ quantity, email for special pricing</p>
                  <p className="font-semibold text-green-600">NO SCREEN FEES</p>
                </div>
              </div>
            </div>

            {/* Additional Printing Charges */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Printing Charges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-3">Finishing Services</h4>
                  <ul className="text-sm text-yellow-800 space-y-2">
                    <li>• Puff Ink - $0.20 per color/garment/placement</li>
                    <li>• Waterbased Ink - $0.20 per color/garment/placement</li>
                    <li>• Discharge Ink - $0.20 per color/garment/placement</li>
                    <li>• Grey Blocker - Add one additional color count</li>
                    <li>• Metallic Inks - Add one additional color count</li>
                  </ul>
                  <div className="mt-3 pt-3 border-t border-yellow-200">
                    <p className="text-xs text-yellow-700">
                      *Minimum of 72 pieces per design/per order for all puff, waterbased and discharge inks
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      *Add one additional color count for designs using grey blocker or metallic inks
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-3">Specialty Inks</h4>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">$0.20</p>
                    <p className="text-sm text-red-800">per color/garment/placement</p>
                    <p className="text-xs text-red-700 mt-2">*Includes standard size sticker</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialty Garments */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Specialty Garments</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Tote Bags, safety vests, long sleeves, pants, mesh material</strong> - add $0.25 per garment/placement</li>
                  <li><strong>Single layer jackets, heavyweight (&gt;10oz), oversized or hard to print</strong> - add $1 per garment/placement</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  *Jacket Printing is at our discretion - please call or email for approval prior to submitting orders
                </p>
              </div>
            </div>

            {/* Specialty Printing Processes */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Specialty Printing Processes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Basic Full Spot Color Process (Simulated)</h4>
                  <p className="text-sm text-purple-800">7 color on white, 8 color on darks</p>
                  <p className="text-xs text-purple-700 mt-2">
                    *For full spot color process prints requiring more than 8 colors, see pricing for &quot;additional colors&quot;
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">4-Color Process (CMYK)</h4>
                  <p className="text-sm text-green-800">6 color pricing</p>
                  <p className="text-xs text-green-700 mt-2">
                    *Please allow an additional 48 hours for quotes and processing on full color jobs
                  </p>
                </div>
              </div>
            </div>

            {/* Other Information and Fees */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Other Information and Fees</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Setup & Processing Fees</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Ink Swap/Screen Fee - $10 per color/design</li>
                    <li>• Separation Fee - Simulated and 4-color process - $20 per color/design</li>
                    <li>• Order Edit Fee - $10 per instance</li>
                    <li>• Preliminary Digital Proof - $30 each</li>
                    <li>• Logo Vectoring/Art Services - starts at $30 per logo</li>
                    <li>• Order Cancellation Fee - $25</li>
                    <li>• Splitting Bulk Blank Garment Orders - $25 per order</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Finishing & Packaging</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Tshirt Fold/Poly Bag - $0.35 each</li>
                    <li>• Non-Tshirt Fold/Poly Bag - $0.50 each</li>
                    <li>• Tshirt Fold ONLY - $0.25</li>
                    <li>• Non-Tshirt Fold ONLY - $0.35</li>
                    <li>• Tshirt Fold/Roll/Band - $0.35 each</li>
                    <li>• Private Label Tag Printing - $0.75 ea. (24 min.)</li>
                    <li>• De-bagging/De-sticker fee - $0.15 per garment</li>
                    <li>• Custom Stickering/Hang Tag Application - $0.15 per garment</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Rush Services */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Rush Services</h3>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-800 mb-2">
                  <strong>Jobs needed in under 7 days (by approval only, 100 piece min.)</strong>
                </p>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• 2-3 day - add 50%</li>
                  <li>• 4-5 day - add 25%</li>
                </ul>
                <p className="text-xs text-orange-700 mt-2">
                  *Add 100% for Rush orders under the 100 piece minimum and/or less than 2 day turnaround. 
                  Rush time starts from once we have a complete PO/order submission, art, and tracking for garments. 
                  Rush services may not be available during peak seasons.
                </p>
              </div>
            </div>

            {/* What's Included */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What&apos;s Included</h3>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-green-800">
                  <div>
                    <h4 className="font-semibold mb-3 text-green-900">NO FEES FOR:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Setup or Screen Fees
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Digital Proof Fees*
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Blind Shipping Fees*
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Handling Fees
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-green-900">INCLUDED SERVICES:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Knowledgeable Service
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Fast Turnaround
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Orders On Time, Every Time
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Free Pantone Color Mixing
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-green-200">
                  <p className="text-xs text-green-700">
                    *No charge digital proof and blind shipping fees limited to one per order.<br />
                    $5 for each additional blind ship address (up to 5, then $10 each)<br />
                    $10 for each additional digital proof and/or order change
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="space-y-3 text-sm text-blue-800">
                  <p>
                    <strong>Underbase on light garments:</strong> For consistency in color, we may run underbase on light 
                    (non-white) garments when the same design is being printed on darks in the same order.
                  </p>
                  <p>
                    <strong>Pre Production Samples:</strong> Standard printing are priced as 1 piece plus all applicable 
                    screen fees. Full color samples are priced at $200 per design plus screen fees plus separation fees. 
                    See our Contract Packet for details.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information & Freight Images */}
            <div className="mb-8">
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="flex flex-col md:grid md:grid-cols-3 gap-8">
                  {/* Left Column - Contact Information */}
                  <div className="text-left md:col-span-1 order-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-2 text-gray-700">
                      <p className="text-lg font-semibold">Stitches Clothing Co.</p>
                      <p>990 Spice Island Dr., Sparks, NV 89431</p>
                      <p><strong>Phone:</strong> (775) 355-9161</p>
                      <p><strong>Email:</strong> <a href="mailto:Info@StitchesClothingCo.com" className="text-blue-600 hover:text-blue-800">Info@StitchesClothingCo.com</a></p>
                      <p><strong>Website:</strong> <a href="https://StitchesClothingCo.com" className="text-blue-600 hover:text-blue-800">StitchesClothingCo.com</a></p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <p className="text-sm text-gray-600">
                        *Pricing effective 3/1/25 and is subject to change without notice
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Freight Images Side by Side */}
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 md:col-span-2 order-2">
                    <img 
                      src="/images/freight1.png" 
                      alt="Freight Information 1" 
                      className="w-full md:flex-1 h-auto max-h-32 object-contain"
                    />
                    <img 
                      src="/images/freight2.png" 
                      alt="Freight Information 2" 
                      className="w-full md:flex-1 h-auto max-h-32 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
