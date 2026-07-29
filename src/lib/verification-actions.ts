'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadPrivateFile } from '@/lib/supabase-storage';

const allowedDocumentTypes = new Set(['passport', 'national-id', 'drivers-license', 'commitment-letter', 'mou', 'other']);
const allowedMimeTypes = new Set(['application/pdf', 'image/png', 'image/jpeg', 'image/webp']);
const maxUploadBytes = 10 * 1024 * 1024;

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function clientVerificationPath(message?: string, isError = false) {
  if (!message) return '/client/verification';
  const key = isError ? 'error' : 'message';
  return `/client/verification?${key}=${encodeURIComponent(message)}`;
}

export async function uploadVerificationDocumentAction(formData: FormData) {
  const client = await requireRole('client');
  const documentType = text(formData, 'documentType');
  const documentNumber = text(formData, 'documentNumber') || null;
  const files = formData.getAll('files').filter((value): value is File => value instanceof File && value.size > 0);

  if (!allowedDocumentTypes.has(documentType)) {
    redirect(clientVerificationPath('Choose a valid document type.', true));
  }

  if (files.length === 0) {
    redirect(clientVerificationPath('Choose at least one document file to upload.', true));
  }

  if (files.some((file) => file.size > maxUploadBytes)) {
    redirect(clientVerificationPath('Each document must be 10MB or smaller.', true));
  }

  if (files.some((file) => !allowedMimeTypes.has(file.type))) {
    redirect(clientVerificationPath('Document must be a PDF, PNG, JPG, or WEBP file.', true));
  }

  const uploads = await Promise.all(files.map(async (file, index) => {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const filePath = await uploadPrivateFile(
      `verification/${client.id}/${documentType}-${Date.now()}-${index}-${safeName}`,
      file,
    );

    return { file, filePath };
  })).catch(() => redirect(clientVerificationPath('Upload failed. Check Supabase Storage configuration.', true)));

  await prisma.verificationDocument.createMany({
    data: uploads.map(({ file, filePath }) => ({
      clientId: client.id,
      documentType,
      documentNumber,
      fileName: file.name,
      filePath,
      mimeType: file.type,
      fileSize: file.size,
      status: 'pending',
    })),
  });

  revalidatePath('/client/verification');
  revalidatePath('/admin/verification');
  redirect(clientVerificationPath(`${files.length} document${files.length === 1 ? '' : 's'} uploaded for admin verification.`));
}
