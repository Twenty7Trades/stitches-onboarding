import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: '2025-11-06-03',
    deployedAt: new Date().toISOString(),
    codeVersion: 'pdfData-v3',
    message: 'This endpoint confirms the new code is deployed',
    submitApplicationReturns: 'pdfData (NOT csvData)'
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Deployment-Version': '2025-11-06-03'
    }
  });
}

