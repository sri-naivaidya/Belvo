import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { SESSION_COOKIE, verifySessionToken, type SessionPayload } from '@/lib/session';

export type AppRole = 'admin' | 'client';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) return null;

  return prisma.profile.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, fullName: true, role: true },
  });
}

export async function requireRole(role: AppRole) {
  const user = await getCurrentUser();
  if (!user) redirect('/');
  if (user.role !== role) redirect(user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard');
  return user;
}

export type { SessionPayload };
