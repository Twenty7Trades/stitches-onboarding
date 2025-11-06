import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { Pool } from 'pg';
import Database from 'better-sqlite3';

const JWT_SECRET = process.env.JWT_SECRET || 'stitches-onboarding-secret-key-2024';
const COOKIE_NAME = 'admin-token';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: AdminUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; name: string };
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name
    };
  } catch {
    return null;
  }
}

export async function authenticateUser(email: string, password: string): Promise<AdminUser | null> {
  try {
    console.log('authenticateUser: Looking for user with email:', email);
    
    // Determine if we're in production (PostgreSQL) or development (SQLite)
    const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.startsWith('postgresql://');
    
    if (isProduction && process.env.DATABASE_URL) {
      // Use PostgreSQL
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      
      const client = await pool.connect();
      try {
        console.log('authenticateUser: Executing PostgreSQL query...');
        const result = await client.query(
          'SELECT * FROM admin_users WHERE email = $1',
          [email]
        );
        console.log('authenticateUser: Query result rows:', result.rows.length);
        
        if (result.rows.length === 0) {
          console.log('authenticateUser: User not found in database');
          return null;
        }
        
        const user = result.rows[0];
        console.log('authenticateUser: User found, verifying password...');
        
        const isValid = await verifyPassword(password, user.password_hash);
        console.log('authenticateUser: Password valid:', isValid);
        
        if (!isValid) {
          console.log('authenticateUser: Invalid password');
          return null;
        }

        // Update last login
        await client.query(
          'UPDATE admin_users SET last_login = NOW() WHERE id = $1',
          [user.id]
        );

        return {
          id: user.id,
          email: user.email,
          name: user.name || 'Admin User'
        };
      } finally {
        client.release();
      }
    } else {
      // Use SQLite for local development
      const db = new Database('stitches.db');
      try {
        console.log('authenticateUser: Using SQLite...');
        const user = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email) as { id: string; email: string; password_hash: string; name: string | null } | undefined;
        
        if (!user) {
          console.log('authenticateUser: User not found in database');
          return null;
        }
        
        console.log('authenticateUser: User found, verifying password...');
        const isValid = await verifyPassword(password, user.password_hash);
        console.log('authenticateUser: Password valid:', isValid);
        
        if (!isValid) {
          console.log('authenticateUser: Invalid password');
          return null;
        }

        // Update last login
        db.prepare('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

        return {
          id: user.id,
          email: user.email,
          name: user.name || 'Admin User'
        };
      } finally {
        db.close();
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function getCurrentUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    
    if (!token) {
      return null;
    }

    return verifyToken(token);
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export async function getCurrentUserFromRequest(request: NextRequest): Promise<AdminUser | null> {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    
    if (!token) {
      return null;
    }

    return verifyToken(token);
  } catch (error) {
    console.error('Get current user from request error:', error);
    return null;
  }
}

export function setAuthCookie(): void {
  // This will be handled by the API route
}

export function clearAuthCookie(): void {
  // This will be handled by the API route
}
