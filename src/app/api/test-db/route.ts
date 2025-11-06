import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';
import { customerQueries, adminQueries } from '@/lib/db';

export async function GET() {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Check if admin user exists
    const adminUser = await adminQueries.getByEmail('sales@pixelprint.la');
    
    // Count customers
    const customers = await customerQueries.getAll();
    
    return NextResponse.json({
      success: true,
      databaseInitialized: true,
      adminUserExists: !!adminUser,
      customerCount: customers.length,
      sampleCustomers: customers.slice(0, 3).map(c => ({
        id: c.id,
        business_name: c.business_name,
        main_email: c.main_email,
        submission_date: c.submission_date
      }))
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
