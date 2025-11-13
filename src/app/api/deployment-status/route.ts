import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    deploymentStatus: 'active',
    timestamp: new Date().toISOString(),
    features: {
      resellerPermit: true,
      passwordChange: true,
      backupCreditCardForACH: true,
      paymentMethodDescriptions: true,
      mobileLayoutFix: true,
      rushServicesTextFix: true
    },
    gitCommits: [
      '75bf9dd - Contract form edits',
      '390b94f - Admin password change',
      '08e0b72 - Reseller permit upload',
      '59570bd - Session summary'
    ],
    buildInfo: {
      nodeEnv: process.env.NODE_ENV,
      buildTime: process.env.BUILD_TIME,
      ci: process.env.CI
    }
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Deployment-Check': 'true'
    }
  });
}

