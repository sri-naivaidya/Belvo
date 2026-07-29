'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  isPaymentStatus,
  isTimelineEventStatus,
  isTimelineEventType,
  type PaymentStatusValue,
} from '@/lib/portal-data';
import { DEFAULT_CURRENCY, PAYMENT_AMOUNT_MAX, normalizeCurrency } from '@/lib/money';
import { uploadPrivateFile } from '@/lib/supabase-storage';

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function optionalText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value.length > 0 ? value : null;
}

function parseAmount(value: string) {
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return null;
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 && amount <= PAYMENT_AMOUNT_MAX ? amount : null;
}

function parseDate(value: string | null) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseDateTime(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function paidAtForStatus(status: PaymentStatusValue, explicitPaidAt: Date | null) {
  if (status !== 'paid') return null;
  return explicitPaidAt ?? new Date();
}

function adminPaymentsPath(message?: string, isError = false) {
  if (!message) return '/admin/payments';
  const key = isError ? 'error' : 'message';
  return `/admin/payments?${key}=${encodeURIComponent(message)}`;
}

function adminTimelinePath(message?: string, isError = false) {
  if (!message) return '/admin/timeline';
  const key = isError ? 'error' : 'message';
  return `/admin/timeline?${key}=${encodeURIComponent(message)}`;
}

function adminPaymentSettingsPath(message?: string, isError = false) {
  if (!message) return '/admin/payments';
  const key = isError ? 'error' : 'message';
  return `/admin/payments?${key}=${encodeURIComponent(message)}`;
}

function adminVerificationPath(message?: string, isError = false) {
  if (!message) return '/admin/verification';
  const key = isError ? 'error' : 'message';
  return `/admin/verification?${key}=${encodeURIComponent(message)}`;
}

function adminClientsPath(message?: string, isError = false) {
  if (!message) return '/admin/clients';
  const key = isError ? 'error' : 'message';
  return `/admin/clients?${key}=${encodeURIComponent(message)}`;
}

async function audit(adminId: string, action: string, entityType: string, entityId: string | null) {
  await prisma.auditLog.create({
    data: { adminId, action, entityType, entityId },
  });
}

function revalidatePayments() {
  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/clients');
  revalidatePath('/admin/payments');
  revalidatePath('/client/dashboard');
  revalidatePath('/client/payments');
}

function revalidateTimeline() {
  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/clients');
  revalidatePath('/admin/timeline');
  revalidatePath('/client/dashboard');
  revalidatePath('/client/timeline');
}

function revalidateClients() {
  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/clients');
  revalidatePath('/admin/payments');
  revalidatePath('/admin/timeline');
  revalidatePath('/admin/verification');
}

export async function createPaymentAction(formData: FormData) {
  const admin = await requireRole('admin');
  const clientId = text(formData, 'clientId');
  const title = text(formData, 'title');
  const amount = parseAmount(text(formData, 'amount'));
  const currency = normalizeCurrency(text(formData, 'currency') || DEFAULT_CURRENCY);
  const statusInput = text(formData, 'status');
  const status = isPaymentStatus(statusInput) ? statusInput : 'pending';
  const dueDate = parseDate(optionalText(formData, 'dueDate'));
  const paidAt = paidAtForStatus(status, parseDateTime(text(formData, 'paidAt')));
  const notes = optionalText(formData, 'notes');

  if (!clientId || !title || amount === null) {
    redirect(adminPaymentsPath(`Enter a client, title, and amount from 0 to ${PAYMENT_AMOUNT_MAX.toLocaleString('en-IN')}.`, true));
  }

  const client = await prisma.profile.findFirst({ where: { id: clientId, role: 'client' }, select: { id: true } });
  if (!client) redirect(adminPaymentsPath('Select a valid client before creating a payment.', true));

  const payment = await prisma.payment
    .create({
      data: { clientId, title, amount, currency, status, dueDate, paidAt, notes },
    })
    .catch(() => redirect(adminPaymentsPath('Payment could not be created. Check the amount, currency, and client details.', true)));
  await audit(admin.id, 'created_payment', 'payment', payment.id);
  revalidatePayments();
  redirect(adminPaymentsPath('Payment created.'));
}

export async function updatePaymentAction(formData: FormData) {
  const admin = await requireRole('admin');
  const id = text(formData, 'id');
  const title = text(formData, 'title');
  const amount = parseAmount(text(formData, 'amount'));
  const currency = normalizeCurrency(text(formData, 'currency') || DEFAULT_CURRENCY);
  const statusInput = text(formData, 'status');
  const status = isPaymentStatus(statusInput) ? statusInput : null;
  const dueDate = parseDate(optionalText(formData, 'dueDate'));
  const paidAt = status ? paidAtForStatus(status, parseDateTime(text(formData, 'paidAt'))) : null;
  const notes = optionalText(formData, 'notes');

  if (!id || !title || amount === null || !status) {
    redirect(adminPaymentsPath(`Enter a title, valid status, and amount from 0 to ${PAYMENT_AMOUNT_MAX.toLocaleString('en-IN')}.`, true));
  }

  const payment = await prisma.payment
    .update({
      where: { id },
      data: { title, amount, currency, status, dueDate, paidAt, notes },
    })
    .catch(() => redirect(adminPaymentsPath('Payment could not be updated. Check that the payment still exists and the amount is valid.', true)));
  await audit(admin.id, 'updated_payment', 'payment', payment.id);
  revalidatePayments();
  redirect(adminPaymentsPath('Payment updated.'));
}

export async function cancelPaymentAction(formData: FormData) {
  const admin = await requireRole('admin');
  const id = text(formData, 'id');
  if (!id) redirect(adminPaymentsPath('Missing payment id.', true));

  const payment = await prisma.payment
    .update({
      where: { id },
      data: { status: 'cancelled', paidAt: null },
    })
    .catch(() => redirect(adminPaymentsPath('Payment could not be cancelled because it was not found.', true)));
  await audit(admin.id, 'cancelled_payment', 'payment', payment.id);
  revalidatePayments();
  redirect(adminPaymentsPath('Payment cancelled.'));
}

export async function createTimelineEventAction(formData: FormData) {
  const admin = await requireRole('admin');
  const clientId = text(formData, 'clientId');
  const title = text(formData, 'title');
  const description = optionalText(formData, 'description');
  const typeInput = text(formData, 'type');
  const type = isTimelineEventType(typeInput) ? typeInput : 'update';
  const statusInput = text(formData, 'status');
  const status = isTimelineEventStatus(statusInput) ? statusInput : 'upcoming';
  const eventDate = parseDateTime(text(formData, 'eventDate'));
  const visibleToClient = formData.get('visibleToClient') === 'on';

  if (!clientId || !title || !eventDate) {
    redirect(adminTimelinePath('Missing client, title, or event date.', true));
  }

  const event = await prisma.timelineEvent.create({
    data: { clientId, title, description, type, status, eventDate, visibleToClient },
  });
  await audit(admin.id, 'created_timeline_event', 'timeline_event', event.id);
  revalidateTimeline();
  redirect(adminTimelinePath('Timeline event created.'));
}

export async function updateTimelineEventAction(formData: FormData) {
  const admin = await requireRole('admin');
  const id = text(formData, 'id');
  const clientId = text(formData, 'clientId');
  const title = text(formData, 'title');
  const description = optionalText(formData, 'description');
  const typeInput = text(formData, 'type');
  const type = isTimelineEventType(typeInput) ? typeInput : null;
  const statusInput = text(formData, 'status');
  const status = isTimelineEventStatus(statusInput) ? statusInput : null;
  const eventDate = parseDateTime(text(formData, 'eventDate'));
  const visibleToClient = formData.get('visibleToClient') === 'on';

  if (!id || !clientId || !title || !type || !status || !eventDate) {
    redirect(adminTimelinePath('Missing timeline event details.', true));
  }

  const event = await prisma.timelineEvent.update({
    where: { id },
    data: { clientId, title, description, type, status, eventDate, visibleToClient },
  });
  await audit(admin.id, 'updated_timeline_event', 'timeline_event', event.id);
  revalidateTimeline();
  redirect(adminTimelinePath('Timeline event updated.'));
}

export async function deleteTimelineEventAction(formData: FormData) {
  const admin = await requireRole('admin');
  const id = text(formData, 'id');
  if (!id) redirect(adminTimelinePath('Missing timeline event id.', true));

  await prisma.timelineEvent.delete({ where: { id } });
  await audit(admin.id, 'deleted_timeline_event', 'timeline_event', id);
  revalidateTimeline();
  redirect(adminTimelinePath('Timeline event deleted.'));
}

export async function updatePaymentSettingsAction(formData: FormData) {
  const admin = await requireRole('admin');
  const upiId = optionalText(formData, 'upiId');
  const receiverName = optionalText(formData, 'receiverName');
  const qrFile = formData.get('qrCode');
  let qrCodePath: string | undefined;

  if (!upiId) redirect(adminPaymentSettingsPath('Enter a valid UPI ID before saving payment settings.', true));

  if (qrFile instanceof File && qrFile.size > 0) {
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(qrFile.type)) {
      redirect(adminPaymentSettingsPath('QR code must be a PNG, JPG, or WEBP image.', true));
    }
    qrCodePath = await uploadPrivateFile(`payment-settings/upi-qr-${Date.now()}-${qrFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`, qrFile)
      .catch(() => redirect(adminPaymentSettingsPath('QR code could not be uploaded to Supabase Storage. Check storage env vars and bucket permissions.', true)));
  }

  const existing = await prisma.paymentSettings.findUnique({ where: { id: 'default' }, select: { qrCodePath: true } });
  await prisma.paymentSettings.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      upiId,
      receiverName,
      qrCodePath: qrCodePath ?? null,
      qrCodeUrl: null,
    },
    update: {
      upiId,
      receiverName,
      qrCodePath: qrCodePath ?? existing?.qrCodePath ?? null,
      qrCodeUrl: null,
    },
  });

  await audit(admin.id, 'updated_payment_settings', 'payment_settings', null);
  revalidatePath('/admin/payments');
  revalidatePath('/admin/settings');
  revalidatePath('/client/payments');
  redirect(adminPaymentSettingsPath('Payment settings saved.'));
}

export async function verifyDocumentAction(formData: FormData) {
  const admin = await requireRole('admin');
  const id = text(formData, 'id');
  const decision = text(formData, 'decision');
  const rejectionReason = optionalText(formData, 'rejectionReason');

  if (!id || (decision !== 'approved' && decision !== 'rejected')) {
    redirect(adminVerificationPath('Choose a valid verification action.', true));
  }

  if (decision === 'rejected' && !rejectionReason) {
    redirect(adminVerificationPath('Add a reason before rejecting a document.', true));
  }

  const document = await prisma.verificationDocument
    .update({
      where: { id },
      data: {
        status: decision,
        rejectionReason: decision === 'rejected' ? rejectionReason : null,
        verifiedAt: new Date(),
        verifiedById: admin.id,
      },
      select: { id: true, clientId: true },
    })
    .catch(() => redirect(adminVerificationPath('Document could not be updated. It may have been removed.', true)));

  await audit(admin.id, `${decision}_verification_document`, 'verification_document', document.id);
  revalidatePath('/admin/verification');
  revalidatePath('/client/verification');
  redirect(adminVerificationPath(`Document ${decision}.`));
}

export async function approveClientDocumentsAction(formData: FormData) {
  const admin = await requireRole('admin');
  const clientId = text(formData, 'clientId');

  if (!clientId) {
    redirect(adminVerificationPath('Choose a client to approve documents for.', true));
  }

  const result = await prisma.verificationDocument.updateMany({
    where: { clientId, status: 'pending' },
    data: { status: 'approved', rejectionReason: null, verifiedAt: new Date(), verifiedById: admin.id },
  });

  if (result.count === 0) {
    redirect(adminVerificationPath('This client has no pending documents to approve.', true));
  }

  await audit(admin.id, 'approved_client_verification_documents', 'client', clientId);
  revalidatePath('/admin/verification');
  revalidatePath('/client/verification');
  redirect(adminVerificationPath(`${result.count} document${result.count === 1 ? '' : 's'} approved.`));
}

export async function deleteClientAction(formData: FormData) {
  const admin = await requireRole('admin');
  const clientId = text(formData, 'clientId');
  const confirmEmail = text(formData, 'confirmEmail');

  if (!clientId) {
    redirect(adminClientsPath('Missing client id.', true));
  }

  const client = await prisma.profile.findFirst({
    where: { id: clientId, role: 'client' },
    select: { id: true, email: true },
  });
  if (!client) {
    redirect(adminClientsPath('Client not found.', true));
  }

  if (client.email !== confirmEmail) {
    redirect(adminClientsPath('Email does not match. Type the client email to confirm deletion.', true));
  }

  if (admin.id === clientId) {
    redirect(adminClientsPath('You cannot delete your own account.', true));
  }

  await prisma.profile.delete({ where: { id: clientId } });
  await audit(admin.id, 'deleted_client', 'profile', clientId);
  revalidateClients();
  redirect(adminClientsPath('Client deleted.'));
}
