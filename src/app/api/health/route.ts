import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  if (!process.env.DATABASE_URL) return NextResponse.json({ configured: false, connected: false }, { status: 503 });
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ configured: true, connected: true });
  } catch {
    return NextResponse.json({ configured: true, connected: false }, { status: 503 });
  }
}
