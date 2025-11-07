import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function POST() {
  try {
    if (!process.env.DATABASE_URL?.startsWith('postgresql://')) {
      return NextResponse.json({
        success: false,
        error: 'Not a PostgreSQL database'
      }, { status: 400 });
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    const client = await pool.connect();
    const results: Record<string, unknown> = {
      timestamp: new Date().toISOString()
    };
    
    try {
      // Check existing columns
      const columnsResult = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'customers'
        ORDER BY column_name
      `);
      const existingColumns = new Set(columnsResult.rows.map(r => r.column_name));
      results.existingColumns = Array.from(existingColumns).sort();
      
      // Add missing columns
      const requiredColumns = [
        { name: 'submission_date', sql: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
        { name: 'status', sql: 'VARCHAR(20) DEFAULT \'pending\'' },
        { name: 'updated_at', sql: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' }
      ];
      
      const addedColumns: string[] = [];
      const errors: string[] = [];
      
      for (const col of requiredColumns) {
        if (!existingColumns.has(col.name)) {
          try {
            await client.query(`ALTER TABLE customers ADD COLUMN ${col.name} ${col.sql}`);
            addedColumns.push(col.name);
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            errors.push(`${col.name}: ${errorMsg}`);
          }
        }
      }
      
      results.addedColumns = addedColumns;
      results.errors = errors;
      
      // Verify columns after migration
      const verifyResult = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'customers'
        ORDER BY column_name
      `);
      results.finalColumns = verifyResult.rows.map(r => r.column_name).sort();
      
    } finally {
      client.release();
      await pool.end();
    }
    
    return NextResponse.json({
      success: true,
      ...results
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
