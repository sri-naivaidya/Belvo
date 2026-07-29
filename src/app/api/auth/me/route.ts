import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session';

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie')?.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]*)`))?.[1];
  const session = await verifySessionToken(cookie);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await prisma.profile.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, fullName: true, role: true },
  });
  if (!profile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ user: profile });
}
