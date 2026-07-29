import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'belvo_session';

export type SessionPayload = {
  userId: string;
  email: string;
  role: 'admin' | 'client';
};

function sessionSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET must be set to a random value with at least 32 characters.');
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(session: SessionPayload) {
  return new SignJWT(session)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(sessionSecret());
}

export async function verifySessionToken(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, sessionSecret());
    if (typeof payload.userId !== 'string' || typeof payload.email !== 'string' || (payload.role !== 'admin' && payload.role !== 'client')) {
      return null;
    }
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
