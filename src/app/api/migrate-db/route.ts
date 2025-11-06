import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';

export async function POST() {
  try {
    console.log('Manual migration trigger - calling initializeDatabase...');
    await initializeDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database initialization/migration completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}

