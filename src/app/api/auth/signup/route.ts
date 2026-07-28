import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSessionToken, SESSION_COOKIE } from '@/lib/session';
import { authFailureMessage, logApiError } from '@/lib/api-error';

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail) || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Use a valid email address and a password of at least 8 characters.' }, { status: 400 });
    }

    const existing = await prisma.profile.findUnique({ where: { email: normalizedEmail }, select: { id: true } });
    if (existing) return NextResponse.json({ error: 'An account already exists for this email address.' }, { status: 409 });

    const profile = await prisma.profile.create({
      data: {
        email: normalizedEmail,
        fullName: typeof fullName === 'string' ? fullName.trim() || null : null,
        passwordHash: await bcrypt.hash(password, 12),
        role: 'client',
      },
    });
    const token = await createSessionToken({ userId: profile.id, email: profile.email, role: profile.role });
    const response = NextResponse.json({ user: { id: profile.id, email: profile.email, fullName: profile.fullName, role: profile.role } }, { status: 201 });
    response.cookies.set({ name: SESSION_COOKIE, value: token, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 });
    return response;
  } catch (error) {
    logApiError('auth.signup', error);
    const failure = authFailureMessage(error);
    return NextResponse.json({ error: failure.error }, { status: failure.status });
  }
}
