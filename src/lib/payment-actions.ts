'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadPrivateFile } from '@/lib/supabase-storage';

const allowedMimeTypes = new Set(['image/png', 'image/jpeg', 'image/webp']);
const maxUploadBytes = 10 * 1024 * 1024;

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function clientPaymentsPath(message?: string, isError = false) {
  if (!message) return '/client/payments';
  const key = isError ? 'error' : 'message';
  return `/client/payments?${key}=${encodeURIComponent(message)}`;
}

export async function uploadPaymentProofAction(formData: FormData) {
  const client = await requireRole('client');
  const paymentId = text(formData, 'paymentId');
  const file = formData.get('proof');

  if (!paymentId) {
    redirect(clientPaymentsPath('Missing payment id.', true));
  }

  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      clientId: client.id,
      status: { in: ['pending', 'overdue'] },
    },
    select: { id: true, title: true },
  });

  if (!payment) {
    redirect(clientPaymentsPath('Payment could not be found or is not open for proof upload.', true));
  }

  if (!(file instanceof File) || file.size === 0) {
    redirect(clientPaymentsPath('Choose a payment screenshot before uploading.', true));
  }

  if (file.size > maxUploadBytes) {
    redirect(clientPaymentsPath('Payment screenshot must be 10MB or smaller.', true));
  }

  if (!allowedMimeTypes.has(file.type)) {
    redirect(clientPaymentsPath('Payment proof must be a PNG, JPG, or WEBP image.', true));
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const filePath = await uploadPrivateFile(`payment-proofs/${client.id}/${payment.id}-${Date.now()}-${safeName}`, file)
    .catch(() => redirect(clientPaymentsPath('Upload failed. Check Supabase Storage configuration.', true)));

  await prisma.paymentProof.create({
    data: {
      paymentId: payment.id,
      clientId: client.id,
      fileName: file.name,
      filePath,
      mimeType: file.type,
      fileSize: file.size,
    },
  });

  await prisma.timelineEvent.create({
    data: {
      clientId: client.id,
      title: 'Payment proof uploaded',
      description: `Screenshot uploaded for ${payment.title}. The team will verify it shortly.`,
      type: 'payment',
      status: 'completed',
      eventDate: new Date(),
      visibleToClient: true,
    },
  });

  revalidatePath('/client/payments');
  revalidatePath('/client/timeline');
  revalidatePath('/admin/payments');
  revalidatePath('/admin/timeline');
  redirect(clientPaymentsPath('Payment screenshot uploaded for review.'));
}
