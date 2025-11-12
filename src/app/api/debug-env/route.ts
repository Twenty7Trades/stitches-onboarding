import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Check all possible environment variable names and formats
  const envCheck: Record<string, unknown> = {
    // Direct checks
    SMTP_HOST: process.env.SMTP_HOST || 'NOT_SET',
    SMTP_PORT: process.env.SMTP_PORT || 'NOT_SET',
    SMTP_USER: process.env.SMTP_USER || 'NOT_SET',
    SMTP_PASS: process.env.SMTP_PASS ? 'SET (hidden)' : 'NOT_SET',
    SMTP_FROM: process.env.SMTP_FROM || 'NOT_SET',
    NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL || 'NOT_SET',
    
    // Check all env vars that start with SMTP
    allSMTPVars: Object.keys(process.env)
      .filter(key => key.startsWith('SMTP') || key.includes('EMAIL'))
      .reduce((acc, key) => {
        acc[key] = key.includes('PASS') ? 'SET (hidden)' : (process.env[key] || 'NOT_SET');
        return acc;
      }, {} as Record<string, string>),
    
    // Node environment info
    NODE_ENV: process.env.NODE_ENV,
    AMPLIFY_ENV: process.env.AMPLIFY_ENV || 'NOT_SET',
    
    // Count total env vars
    totalEnvVars: Object.keys(process.env).length,
    
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(envCheck, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  });
}


