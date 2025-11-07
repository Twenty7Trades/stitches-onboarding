import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) || 'N/A',
    buildTime: process.env.BUILD_TIME,
    ci: process.env.CI,
    isBuildTime: process.env.BUILD_TIME === 'true' || process.env.BUILD_TIME === '1' || process.env.CI === 'true',
    isProduction: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.startsWith('postgresql://'),
    timestamp: new Date().toISOString()
  });
}

