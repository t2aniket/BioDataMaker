import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_session';

export function signSession(email: string): string {
  const hmac = crypto.createHmac('sha256', process.env.JWT_SECRET || 'super-secret-admin-jwt-token-key');
  hmac.update(email);
  const sig = hmac.digest('hex');
  return `${email}:${sig}`;
}

export function verifySession(token: string): string | null {
  const parts = token.split(':');
  if (parts.length !== 2) return null;
  const [email, sig] = parts;
  const hmac = crypto.createHmac('sha256', process.env.JWT_SECRET || 'super-secret-admin-jwt-token-key');
  hmac.update(email);
  const expected = hmac.digest('hex');
  if (sig === expected) return email;
  return null;
}

export async function getSessionEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  if (!session) return null;
  return verifySession(session.value);
}

export async function setSessionCookie(email: string) {
  const token = signSession(email);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function removeSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
