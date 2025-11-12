import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest, verifyPassword, hashPassword } from '@/lib/simple-auth';
import { getDatabase } from '@/lib/db';
import { Pool } from 'pg';
import Database from 'better-sqlite3';

const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.startsWith('postgresql://');

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Verify current password
    const database = getDatabase();
    if (!database) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    let currentPasswordHash = '';
    if (isProduction && database) {
      const client = await (database as Pool).connect();
      try {
        const result = await client.query(
          'SELECT password_hash FROM admin_users WHERE id = $1',
          [user.id]
        );
        if (result.rows.length === 0) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        currentPasswordHash = result.rows[0].password_hash;
      } finally {
        client.release();
      }
    } else if (database) {
      const result = (database as Database.Database).prepare(
        'SELECT password_hash FROM admin_users WHERE id = ?'
      ).get(user.id) as { password_hash: string } | undefined;
      
      if (!result) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      currentPasswordHash = result.password_hash;
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, currentPasswordHash);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    if (isProduction && database) {
      const client = await (database as Pool).connect();
      try {
        await client.query(
          'UPDATE admin_users SET password_hash = $1 WHERE id = $2',
          [newPasswordHash, user.id]
        );
      } finally {
        client.release();
      }
    } else if (database) {
      (database as Database.Database).prepare(
        'UPDATE admin_users SET password_hash = ? WHERE id = ?'
      ).run(newPasswordHash, user.id);
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      {
        error: 'Failed to change password',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

