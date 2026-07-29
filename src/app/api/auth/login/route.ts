import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSessionToken, SESSION_COOKIE } from '@/lib/session';
import { authFailureMessage, logApiError } from '@/lib/api-error';

function sessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!profile || !(await bcrypt.compare(password, profile.passwordHash))) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = await createSessionToken({ userId: profile.id, email: profile.email, role: profile.role });
    const response = NextResponse.json({ user: { id: profile.id, email: profile.email, fullName: profile.fullName, role: profile.role } });
    response.cookies.set(sessionCookie(token));
    return response;
  } catch (error) {
    logApiError('auth.login', error);
    const failure = authFailureMessage(error);
    return NextResponse.json({ error: failure.error }, { status: failure.status });
  }
}
