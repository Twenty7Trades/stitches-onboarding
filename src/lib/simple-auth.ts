import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { adminQueries } from './db';

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
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name
    };
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(email: string, password: string): Promise<AdminUser | null> {
  try {
    const user = await adminQueries.getByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return null;
    }

    // Update last login
    await adminQueries.updateLastLogin(user.id);

    return {
      id: user.id,
      email: user.email,
      name: user.name || 'Admin User'
    };
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

export function setAuthCookie(token: string): void {
  // This will be handled by the API route
}

export function clearAuthCookie(): void {
  // This will be handled by the API route
}
