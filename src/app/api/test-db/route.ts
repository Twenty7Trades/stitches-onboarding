import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';
import { customerQueries, adminQueries } from '@/lib/db';

export async function GET() {
  try {
    // Initialize database (this should create admin user if it doesn't exist)
    await initializeDatabase();
    
    // Wait a moment for any async operations to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if admin user exists
    const adminUser = await adminQueries.getByEmail('sales@pixelprint.la');
    
    // Count customers
    const customers = await customerQueries.getAll();
    
    return NextResponse.json({
      success: true,
      databaseConnected: true,
      userFound: !!adminUser,
      user: adminUser ? {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name
      } : null,
      databaseInitialized: true,
      adminUserExists: !!adminUser,
      customerCount: customers.length,
      sampleCustomers: customers.slice(0, 3).map(c => ({
        id: c.id,
        business_name: c.business_name,
        main_email: c.main_email,
        submission_date: c.submission_date
      }))
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      {
        success: false,
        databaseConnected: false,
        userFound: false,
        user: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
