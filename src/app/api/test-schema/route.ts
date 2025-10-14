import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET() {
  try {
    console.log('Testing database schema...');
    
    const database = getDatabase();
    if (!database) {
      return NextResponse.json({
        success: false,
        error: 'No database connection'
      });
    }
    
    // Test if we can query the admin_users table
    const client = await database.connect();
    try {
      // Check if table exists
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'admin_users'
        );
      `);
      
      console.log('Table exists:', tableCheck.rows[0].exists);
      
      if (!tableCheck.rows[0].exists) {
        return NextResponse.json({
          success: false,
          error: 'admin_users table does not exist'
        });
      }
      
      // Check table structure
      const columns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'admin_users'
        ORDER BY ordinal_position;
      `);
      
      console.log('Table columns:', columns.rows);
      
      // Try to query all users
      const allUsers = await client.query(`
        SELECT id, email, name FROM admin_users;
      `);
      
      console.log('All users:', allUsers.rows);
      
      // Try to query specific user
      const specificUser = await client.query(`
        SELECT * FROM admin_users WHERE email = $1;
      `, ['sales@pixelprint.la']);
      
      console.log('Specific user query result:', specificUser.rows);
      
      return NextResponse.json({
        success: true,
        tableExists: true,
        columns: columns.rows,
        allUsers: allUsers.rows,
        specificUser: specificUser.rows[0] || null
      });
      
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database schema test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database schema test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
