'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentUser, requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  isChangeImpact,
  isChangePriority,
  isMeetingStatus,
  isProjectDocumentType,
} from '@/lib/portal-data';
import { uploadPrivateFile } from '@/lib/supabase-storage';

const documentMimeTypes = new Set(['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'video/mp4']);
const maxDocumentBytes = 20 * 1024 * 1024;
const chatFallbackTitle = 'Client message';

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function optionalText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value.length > 0 ? value : null;
}

function parsePositiveInt(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseMoney(value: string) {
  if (!value) return 0;
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function parseScheduledAt(formData: FormData) {
  const date = text(formData, 'date');
  const time = text(formData, 'time');
  if (!date || !time) return null;
  const scheduledAt = new Date(`${date}T${time}`);
  return Number.isNaN(scheduledAt.getTime()) ? null : scheduledAt;
}

function pathWithMessage(path: string, message?: string, isError = false) {
  if (!message) return path;
  const key = isError ? 'error' : 'message';
  return `${path}?${key}=${encodeURIComponent(message)}`;
}

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-');
}

async function audit(adminId: string, action: string, entityType: string, entityId: string | null) {
  await prisma.auditLog.create({ data: { adminId, action, entityType, entityId } });
}

function revalidateMeetings() {
  revalidatePath('/client/meetings');
  revalidatePath('/admin/meetings');
  revalidatePath('/client/dashboard');
  revalidatePath('/admin/dashboard');
}

export async function createClientMeetingAction(formData: FormData) {
  const client = await requireRole('client');
  const title = text(formData, 'title');
  const agenda = optionalText(formData, 'agenda');
  const scheduledAt = parseScheduledAt(formData);
  const durationMinutes = parsePositiveInt(text(formData, 'durationMinutes'), 45);
  const participants = optionalText(formData, 'participants');
  const meetingLink = optionalText(formData, 'meetingLink');

  if (!title || !scheduledAt) {
    redirect(pathWithMessage('/client/meetings', 'Enter a title, date, and time before scheduling.', true));
  }

  await prisma.meeting.create({
    data: {
      clientId: client.id,
      title,
      agenda,
      scheduledAt,
      durationMinutes,
      participants,
      meetingLink,
      status: 'upcoming',
    },
  });

  revalidateMeetings();
  redirect(pathWithMessage('/client/meetings', 'Meeting request saved.'));
}

export async function createAdminMeetingAction(formData: FormData) {
  const admin = await requireRole('admin');
  const clientId = text(formData, 'clientId');
  const title = text(formData, 'title');
  const agenda = optionalText(formData, 'agenda');
  const scheduledAt = parseScheduledAt(formData);
  const durationMinutes = parsePositiveInt(text(formData, 'durationMinutes'), 45);
  const participants = optionalText(formData, 'participants');
  const meetingLink = optionalText(formData, 'meetingLink');
  const statusInput = text(formData, 'status');
  const status = isMeetingStatus(statusInput) ? statusInput : 'upcoming';

  if (!clientId || !title || !scheduledAt) {
    redirect(pathWithMessage('/admin/meetings', 'Choose a client and enter meeting title, date, and time.', true));
  }

  const client = await prisma.profile.findFirst({ where: { id: clientId, role: 'client' }, select: { id: true } });
  if (!client) redirect(pathWithMessage('/admin/meetings', 'Choose a valid client account.', true));

  const meeting = await prisma.meeting.create({
    data: { clientId, title, agenda, scheduledAt, durationMinutes, participants, meetingLink, status },
  });
  await audit(admin.id, 'created_meeting', 'meeting', meeting.id);
  revalidateMeetings();
  redirect(pathWithMessage('/admin/meetings', 'Meeting created.'));
}

export async function updateMeetingStatusAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect('/');

  const id = text(formData, 'id');
  const statusInput = text(formData, 'status');
  const status = isMeetingStatus(statusInput) ? statusInput : null;
  if (!id || !status) {
    redirect(pathWithMessage(user.role === 'admin' ? '/admin/meetings' : '/client/meetings', 'Choose a valid meeting action.', true));
  }

  const where = user.role === 'admin' ? { id } : { id, clientId: user.id };
  if (user.role === 'client' && !['accepted', 'cancelled'].includes(status)) {
    redirect(pathWithMessage('/client/meetings', 'Clients can only accept or cancel meetings.', true));
  }

  const meeting = await prisma.meeting.update({ where, data: { status } }).catch(() => null);
  if (!meeting) {
    redirect(pathWithMessage(user.role === 'admin' ? '/admin/meetings' : '/client/meetings', 'Meeting could not be updated.', true));
  }

  if (user.role === 'admin') await audit(user.id, `updated_meeting_${status}`, 'meeting', meeting.id);
  revalidateMeetings();
  redirect(pathWithMessage(user.role === 'admin' ? '/admin/meetings' : '/client/meetings', 'Meeting updated.'));
}

export async function deleteMeetingAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect('/');

  const id = text(formData, 'id');
  if (!id) redirect(pathWithMessage(user.role === 'admin' ? '/admin/meetings' : '/client/meetings', 'Missing meeting id.', true));

  const where = user.role === 'admin' ? { id } : { id, clientId: user.id };
  const meeting = await prisma.meeting.delete({ where }).catch(() => null);
  if (!meeting) {
    redirect(pathWithMessage(user.role === 'admin' ? '/admin/meetings' : '/client/meetings', 'Meeting could not be deleted.', true));
  }

  if (user.role === 'admin') await audit(user.id, 'deleted_meeting', 'meeting', meeting.id);
  revalidateMeetings();
  redirect(pathWithMessage(user.role === 'admin' ? '/admin/meetings' : '/client/meetings', 'Meeting deleted.'));
}

export async function uploadProjectDocumentAction(formData: FormData) {
  const client = await requireRole('client');
  const name = text(formData, 'name');
  const typeInput = text(formData, 'type');
  const type = isProjectDocumentType(typeInput) ? typeInput : 'deliverable';
  const projectId = optionalText(formData, 'projectId');
  const milestoneId = optionalText(formData, 'milestoneId');
  const file = formData.get('file');

  if (!name) redirect(pathWithMessage('/client/documents', 'Enter a document name.', true));
  if (!(file instanceof File) || file.size === 0) redirect(pathWithMessage('/client/documents', 'Choose a document file to upload.', true));
  if (file.size > maxDocumentBytes) redirect(pathWithMessage('/client/documents', 'Document must be 20MB or smaller.', true));
  if (!documentMimeTypes.has(file.type)) redirect(pathWithMessage('/client/documents', 'Document must be PDF, PNG, JPG, WEBP, or MP4.', true));

  if (projectId) {
    const project = await prisma.project.findFirst({ where: { id: projectId, clientId: client.id }, select: { id: true } });
    if (!project) redirect(pathWithMessage('/client/documents', 'Choose a valid project.', true));
  }

  if (milestoneId) {
    const milestone = await prisma.milestone.findFirst({
      where: { id: milestoneId, project: { clientId: client.id } },
      select: { id: true },
    });
    if (!milestone) redirect(pathWithMessage('/client/documents', 'Choose a valid milestone.', true));
  }

  const filePath = await uploadPrivateFile(
    `project-documents/${client.id}/${Date.now()}-${safeFileName(file.name)}`,
    file,
  ).catch(() => redirect(pathWithMessage('/client/documents', 'Upload failed. Check Supabase Storage configuration.', true)));

  await prisma.projectDocument.create({
    data: {
      clientId: client.id,
      projectId,
      milestoneId,
      uploadedById: client.id,
      name,
      type,
      fileName: file.name,
      filePath,
      mimeType: file.type,
      fileSize: file.size,
    },
  });

  revalidatePath('/client/documents');
  revalidatePath('/client/milestones');
  revalidatePath('/client/reports');
  redirect(pathWithMessage('/client/documents', 'Document uploaded.'));
}

export async function createPortalMessageAction(formData: FormData) {
  const client = await requireRole('client');
  const body = text(formData, 'body');
  if (!body) redirect(pathWithMessage('/client/chat', 'Enter a message before sending.', true));

  try {
    await prisma.portalMessage.create({
      data: {
        clientId: client.id,
        senderId: client.id,
        body,
        readByClient: true,
        readByAdmin: false,
      },
    });
  } catch (error) {
    console.error('[workspace-actions] portal message create failed, using timeline fallback', error);
    await prisma.timelineEvent.create({
      data: {
        clientId: client.id,
        title: chatFallbackTitle,
        description: body,
        type: 'update',
        status: 'completed',
        eventDate: new Date(),
        visibleToClient: true,
      },
    }).catch((fallbackError) => {
      console.error('[workspace-actions] chat fallback create failed', fallbackError);
      redirect(pathWithMessage('/client/chat', 'Message could not be saved. Please try again.', true));
    });
  }

  revalidatePath('/client/chat');
  revalidatePath('/client/timeline');
  redirect(pathWithMessage('/client/chat', 'Message sent.'));
}

export async function createChangeRequestAction(formData: FormData) {
  const client = await requireRole('client');
  const projectId = optionalText(formData, 'projectId');
  const title = text(formData, 'title');
  const description = text(formData, 'description');
  const impactInput = text(formData, 'impact');
  const priorityInput = text(formData, 'priority');
  const impact = isChangeImpact(impactInput) ? impactInput : 'medium';
  const priority = isChangePriority(priorityInput) ? priorityInput : 'medium';
  const estimatedCost = parseMoney(text(formData, 'estimatedCost'));
  const timelineImpact = optionalText(formData, 'timelineImpact');

  if (!title || !description || estimatedCost === null) {
    redirect(pathWithMessage('/client/changes', 'Enter title, description, and a valid estimated cost.', true));
  }

  if (projectId) {
    const project = await prisma.project.findFirst({ where: { id: projectId, clientId: client.id }, select: { id: true } });
    if (!project) redirect(pathWithMessage('/client/changes', 'Choose a valid project.', true));
  }

  await prisma.changeRequest.create({
    data: {
      clientId: client.id,
      projectId,
      title,
      description,
      impact,
      priority,
      estimatedCost,
      timelineImpact,
    },
  });

  revalidatePath('/client/changes');
  revalidatePath('/client/reports');
  redirect(pathWithMessage('/client/changes', 'Change request submitted.'));
}
