import { NextRequest, NextResponse } from 'next/server';
import { customerQueries, initializeDatabase } from '@/lib/db';
import { Pool } from 'pg';

export async function GET() {
  try {
    await initializeDatabase();
    
    const results: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) || 'N/A'
    };
    
    // Try to get customers using getAll
    try {
      const customers = await customerQueries.getAll();
      results.getAllResult = {
        success: true,
        count: customers?.length || 0,
        firstCustomer: customers?.[0] ? {
          id: customers[0].id,
          business_name: customers[0].business_name
        } : null
      };
    } catch (error) {
      results.getAllResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
    
    // Try direct PostgreSQL query if in production
    if (process.env.DATABASE_URL?.startsWith('postgresql://')) {
      try {
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        });
        const client = await pool.connect();
        try {
          // Check if table exists
          const tableCheck = await client.query(`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = 'customers'
            )
          `);
          results.tableExists = tableCheck.rows[0].exists;
          
          // Get customer count directly
          const countResult = await client.query('SELECT COUNT(*) as count FROM customers');
          results.directCount = parseInt(countResult.rows[0].count);
          
          // Get latest customer
          const latestResult = await client.query(`
            SELECT id, business_name, submission_date 
            FROM customers 
            ORDER BY submission_date DESC 
            LIMIT 1
          `);
          results.latestCustomer = latestResult.rows[0] || null;
        } finally {
          client.release();
          await pool.end();
        }
      } catch (error) {
        results.directQuery = {
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
    
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

