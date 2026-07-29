'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function optionalText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value.length > 0 ? value : null;
}

function optionalAge(formData: FormData) {
  const value = text(formData, 'age');
  if (!value) return null;
  const age = Number(value);
  return Number.isInteger(age) && age >= 0 && age <= 120 ? age : null;
}

function profileData(formData: FormData) {
  return {
    fullName: optionalText(formData, 'fullName'),
    company: optionalText(formData, 'company'),
    phone: optionalText(formData, 'phone'),
    gender: optionalText(formData, 'gender'),
    age: optionalAge(formData),
    website: optionalText(formData, 'website'),
    instagram: optionalText(formData, 'instagram'),
    linkedin: optionalText(formData, 'linkedin'),
    street: optionalText(formData, 'street'),
    city: optionalText(formData, 'city'),
    state: optionalText(formData, 'state'),
    postalCode: optionalText(formData, 'postalCode'),
    country: optionalText(formData, 'country'),
    gstNumber: optionalText(formData, 'gstNumber'),
    bpitNumber: optionalText(formData, 'bpitNumber'),
    emailNotifications: formData.get('emailNotifications') === 'on',
    weeklySummary: formData.get('weeklySummary') === 'on',
    twoFactorEnabled: formData.get('twoFactorEnabled') === 'on',
  };
}

function revalidateClientProfile(clientId?: string) {
  revalidatePath('/client/dashboard');
  revalidatePath('/client/settings');
  revalidatePath('/admin/clients');
  revalidatePath('/admin/dashboard');
  if (clientId) {
    revalidatePath(`/admin/clients?clientId=${clientId}`);
  }
}

async function audit(adminId: string, action: string, entityType: string, entityId: string | null) {
  await prisma.auditLog.create({ data: { adminId, action, entityType, entityId } });
}

export async function updateClientProfileAction(formData: FormData) {
  const user = await requireRole('client');
  await prisma.profile.update({
    where: { id: user.id },
    data: profileData(formData),
  });
  revalidateClientProfile(user.id);
  redirect('/client/settings?message=Profile updated.');
}

export async function changeClientPasswordAction(formData: FormData) {
  const user = await requireRole('client');
  const currentPassword = text(formData, 'currentPassword');
  const newPassword = text(formData, 'newPassword');
  const confirmPassword = text(formData, 'confirmPassword');

  if (newPassword.length < 8) {
    redirect('/client/settings?message=New password must be at least 8 characters.');
  }
  if (newPassword !== confirmPassword) {
    redirect('/client/settings?message=Password confirmation does not match.');
  }

  const profile = await prisma.profile.findUniqueOrThrow({
    where: { id: user.id },
    select: { passwordHash: true },
  });
  if (!(await bcrypt.compare(currentPassword, profile.passwordHash))) {
    redirect('/client/settings?message=Current password is incorrect.');
  }

  await prisma.profile.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(newPassword, 12) },
  });
  redirect('/client/settings?message=Password updated.');
}

export async function updateAdminClientProfileAction(formData: FormData) {
  const admin = await requireRole('admin');
  const clientId = text(formData, 'clientId');
  if (!clientId) redirect('/admin/clients?message=Missing client id.');

  await prisma.profile.update({
    where: { id: clientId, role: 'client' },
    data: profileData(formData),
  });
  await audit(admin.id, 'updated_client_profile', 'profile', clientId);
  revalidateClientProfile(clientId);
  redirect('/admin/clients?message=Client profile updated.');
}
