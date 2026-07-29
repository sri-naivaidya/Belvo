import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { createSignedFileUrl } from '@/lib/supabase-storage';

export const paymentStatuses = ['pending', 'paid', 'overdue', 'cancelled'] as const;
export type PaymentStatusValue = (typeof paymentStatuses)[number];

export const timelineEventTypes = ['milestone', 'meeting', 'payment', 'document', 'update'] as const;
export type TimelineEventTypeValue = (typeof timelineEventTypes)[number];

export const timelineEventStatuses = ['upcoming', 'completed', 'cancelled'] as const;
export type TimelineEventStatusValue = (typeof timelineEventStatuses)[number];

export const projectStatuses = ['not_started', 'active', 'on_hold', 'completed', 'cancelled'] as const;
export type ProjectStatusValue = (typeof projectStatuses)[number];

export const projectHealthValues = ['good', 'warning', 'critical'] as const;
export type ProjectHealthValue = (typeof projectHealthValues)[number];

export const milestoneStatuses = ['not_started', 'in_progress', 'under_review', 'completed', 'delayed', 'needs_revision'] as const;
export type MilestoneStatusValue = (typeof milestoneStatuses)[number];

export const projectDocumentTypes = ['folder', 'contract', 'invoice', 'deliverable', 'image', 'video', 'other'] as const;
export type ProjectDocumentTypeValue = (typeof projectDocumentTypes)[number];

export const meetingStatuses = ['upcoming', 'accepted', 'completed', 'cancelled'] as const;
export type MeetingStatusValue = (typeof meetingStatuses)[number];

export const changeImpacts = ['low', 'medium', 'high'] as const;
export type ChangeImpactValue = (typeof changeImpacts)[number];

export const changeRequestStatuses = ['pending', 'approved', 'rejected'] as const;
export type ChangeRequestStatusValue = (typeof changeRequestStatuses)[number];

export const changePriorities = ['low', 'medium', 'high', 'critical'] as const;
export type ChangePriorityValue = (typeof changePriorities)[number];

export type AdminClientRecord = {
  id: string;
  email: string;
  fullName: string | null;
  company: string | null;
  phone: string | null;
  gender: string | null;
  age: number | null;
  website: string | null;
  instagram: string | null;
  linkedin: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  gstNumber: string | null;
  bpitNumber: string | null;
  emailNotifications: boolean;
  weeklySummary: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  paymentsCount: number;
  timelineEventsCount: number;
};

export type ClientProfileRecord = Omit<AdminClientRecord, 'paymentsCount' | 'timelineEventsCount'>;

export type ClientDashboardRecord = {
  profile: ClientProfileRecord;
  payments: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
    cancelled: number;
    outstandingAmount: number;
  };
  timeline: {
    totalVisible: number;
    upcoming: number;
    completed: number;
    recent: ClientTimelineEventRecord[];
  };
};

export type AdminPaymentRecord = {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  title: string;
  amount: number;
  currency: string;
  status: PaymentStatusValue;
  dueDate: string | null;
  paidAt: string | null;
  notes: string | null;
  createdAt: string;
  proofs?: PaymentProofRecord[];
};

export type ClientPaymentRecord = Omit<AdminPaymentRecord, 'clientName' | 'clientEmail'>;

export type PaymentProofRecord = {
  id: string;
  paymentId: string;
  fileName: string;
  filePath: string;
  fileUrl: string | null;
  mimeType: string | null;
  fileSize: number | null;
  createdAt: string;
};

export type AdminTimelineEventRecord = {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  title: string;
  description: string | null;
  type: TimelineEventTypeValue;
  eventDate: string;
  status: TimelineEventStatusValue;
  visibleToClient: boolean;
  createdAt: string;
};

export type ClientTimelineEventRecord = Omit<AdminTimelineEventRecord, 'clientName' | 'clientEmail'>;

export type PaymentSettingsRecord = {
  upiId: string | null;
  receiverName: string | null;
  qrCodePath: string | null;
  qrCodeUrl: string | null;
  updatedAt: string | null;
};

export type VerificationStatusValue = 'pending' | 'approved' | 'rejected';

export type VerificationDocumentRecord = {
  id: string;
  clientId: string;
  clientName?: string;
  clientEmail?: string;
  documentType: string;
  documentNumber: string | null;
  fileName: string;
  filePath: string;
  fileUrl: string | null;
  mimeType: string | null;
  fileSize: number | null;
  status: VerificationStatusValue;
  rejectionReason: string | null;
  verifiedAt: string | null;
  createdAt: string;
};

export type ClientProjectRecord = {
  id: string;
  clientId: string;
  name: string;
  description: string | null;
  progress: number;
  health: ProjectHealthValue;
  status: ProjectStatusValue;
  startDate: string | null;
  expectedCompletion: string | null;
  projectManager: string | null;
  budget: number;
  spent: number;
  visibleToClient: boolean;
  createdAt: string;
  milestonesCount: number;
  documentsCount: number;
  changeRequestsCount: number;
};

export type ClientMilestoneRecord = {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string | null;
  status: MilestoneStatusValue;
  expectedDate: string | null;
  completionDate: string | null;
  progress: number;
  createdAt: string;
  deliverables: ProjectDocumentRecord[];
};

export type ProjectDocumentRecord = {
  id: string;
  clientId: string;
  projectId: string | null;
  projectName: string | null;
  milestoneId: string | null;
  milestoneTitle: string | null;
  name: string;
  type: ProjectDocumentTypeValue;
  fileName: string | null;
  filePath: string | null;
  fileUrl: string | null;
  externalUrl: string | null;
  mimeType: string | null;
  fileSize: number | null;
  version: number;
  visibleToClient: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MeetingRecord = {
  id: string;
  clientId: string;
  clientName?: string;
  clientEmail?: string;
  title: string;
  agenda: string | null;
  scheduledAt: string;
  durationMinutes: number;
  participants: string | null;
  meetingLink: string | null;
  status: MeetingStatusValue;
  createdAt: string;
};

export type PortalMessageRecord = {
  id: string;
  clientId: string;
  body: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderRole: 'admin' | 'client';
  attachmentName: string | null;
  attachmentUrl: string | null;
  createdAt: string;
};

export type ChangeRequestRecord = {
  id: string;
  clientId: string;
  projectId: string | null;
  projectName: string | null;
  title: string;
  description: string;
  impact: ChangeImpactValue;
  estimatedCost: number;
  timelineImpact: string | null;
  status: ChangeRequestStatusValue;
  priority: ChangePriorityValue;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClientReportsRecord = {
  projects: {
    total: number;
    active: number;
    completed: number;
    averageProgress: number;
    totalBudget: number;
    totalSpent: number;
  };
  payments: {
    paid: number;
    outstanding: number;
    overdueCount: number;
  };
  changeRequests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  projectRows: ClientProjectRecord[];
};

function dateOnly(value: Date | null): string | null {
  return value ? value.toISOString().slice(0, 10) : null;
}

function dateTime(value: Date): string {
  return value.toISOString();
}

function clientLabel(profile: { fullName: string | null; email: string }) {
  return profile.fullName || profile.email;
}

async function safeWorkspaceQuery<T>(label: string, query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.error(`[portal-data] ${label} failed`, error);
    return fallback;
  }
}

function mapClientProfile(profile: {
  id: string;
  email: string;
  fullName: string | null;
  company: string | null;
  phone: string | null;
  gender: string | null;
  age: number | null;
  website: string | null;
  instagram: string | null;
  linkedin: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  gstNumber: string | null;
  bpitNumber: string | null;
  emailNotifications: boolean;
  weeklySummary: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  _count?: { payments: number; timeline: number };
}): AdminClientRecord {
  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.fullName,
    company: profile.company,
    phone: profile.phone,
    gender: profile.gender,
    age: profile.age,
    website: profile.website,
    instagram: profile.instagram,
    linkedin: profile.linkedin,
    street: profile.street,
    city: profile.city,
    state: profile.state,
    postalCode: profile.postalCode,
    country: profile.country,
    gstNumber: profile.gstNumber,
    bpitNumber: profile.bpitNumber,
    emailNotifications: profile.emailNotifications,
    weeklySummary: profile.weeklySummary,
    twoFactorEnabled: profile.twoFactorEnabled,
    createdAt: dateTime(profile.createdAt),
    paymentsCount: profile._count?.payments ?? 0,
    timelineEventsCount: profile._count?.timeline ?? 0,
  };
}

function mapAdminPayment(payment: {
  id: string;
  clientId: string;
  title: string;
  amount: Prisma.Decimal;
  currency: string;
  status: PaymentStatusValue;
  dueDate: Date | null;
  paidAt: Date | null;
  notes: string | null;
  createdAt: Date;
  client: { fullName: string | null; email: string };
  proofs?: {
    id: string;
    paymentId: string;
    fileName: string;
    filePath: string;
    mimeType: string | null;
    fileSize: number | null;
    createdAt: Date;
  }[];
}): AdminPaymentRecord {
  return {
    id: payment.id,
    clientId: payment.clientId,
    clientName: clientLabel(payment.client),
    clientEmail: payment.client.email,
    title: payment.title,
    amount: Number(payment.amount),
    currency: payment.currency,
    status: payment.status,
    dueDate: dateOnly(payment.dueDate),
    paidAt: payment.paidAt ? dateTime(payment.paidAt) : null,
    notes: payment.notes,
    createdAt: dateTime(payment.createdAt),
    proofs: payment.proofs?.map((proof) => ({
      id: proof.id,
      paymentId: proof.paymentId,
      fileName: proof.fileName,
      filePath: proof.filePath,
      fileUrl: null,
      mimeType: proof.mimeType,
      fileSize: proof.fileSize,
      createdAt: dateTime(proof.createdAt),
    })),
  };
}

async function mapPaymentProofs(proofs: {
  id: string;
  paymentId: string;
  fileName: string;
  filePath: string;
  mimeType: string | null;
  fileSize: number | null;
  createdAt: Date;
}[]): Promise<PaymentProofRecord[]> {
  return Promise.all(proofs.map(async (proof) => ({
    id: proof.id,
    paymentId: proof.paymentId,
    fileName: proof.fileName,
    filePath: proof.filePath,
    fileUrl: await createSignedFileUrl(proof.filePath),
    mimeType: proof.mimeType,
    fileSize: proof.fileSize,
    createdAt: dateTime(proof.createdAt),
  })));
}

function mapAdminTimelineEvent(event: {
  id: string;
  clientId: string;
  title: string;
  description: string | null;
  type: TimelineEventTypeValue;
  eventDate: Date;
  status: TimelineEventStatusValue;
  visibleToClient: boolean;
  createdAt: Date;
  client: { fullName: string | null; email: string };
}): AdminTimelineEventRecord {
  return {
    id: event.id,
    clientId: event.clientId,
    clientName: clientLabel(event.client),
    clientEmail: event.client.email,
    title: event.title,
    description: event.description,
    type: event.type,
    eventDate: dateTime(event.eventDate),
    status: event.status,
    visibleToClient: event.visibleToClient,
    createdAt: dateTime(event.createdAt),
  };
}

function mapClientProject(project: {
  id: string;
  clientId: string;
  name: string;
  description: string | null;
  progress: number;
  health: ProjectHealthValue;
  status: ProjectStatusValue;
  startDate: Date | null;
  expectedCompletion: Date | null;
  projectManager: string | null;
  budget: Prisma.Decimal;
  spent: Prisma.Decimal;
  visibleToClient: boolean;
  createdAt: Date;
  _count?: { milestones: number; documents: number; changeRequests: number };
}): ClientProjectRecord {
  return {
    id: project.id,
    clientId: project.clientId,
    name: project.name,
    description: project.description,
    progress: project.progress,
    health: project.health,
    status: project.status,
    startDate: dateOnly(project.startDate),
    expectedCompletion: dateOnly(project.expectedCompletion),
    projectManager: project.projectManager,
    budget: Number(project.budget),
    spent: Number(project.spent),
    visibleToClient: project.visibleToClient,
    createdAt: dateTime(project.createdAt),
    milestonesCount: project._count?.milestones ?? 0,
    documentsCount: project._count?.documents ?? 0,
    changeRequestsCount: project._count?.changeRequests ?? 0,
  };
}

async function mapProjectDocument(document: {
  id: string;
  clientId: string;
  projectId: string | null;
  milestoneId: string | null;
  name: string;
  type: ProjectDocumentTypeValue;
  fileName: string | null;
  filePath: string | null;
  externalUrl: string | null;
  mimeType: string | null;
  fileSize: number | null;
  version: number;
  visibleToClient: boolean;
  createdAt: Date;
  updatedAt: Date;
  project?: { name: string } | null;
  milestone?: { title: string } | null;
}): Promise<ProjectDocumentRecord> {
  return {
    id: document.id,
    clientId: document.clientId,
    projectId: document.projectId,
    projectName: document.project?.name ?? null,
    milestoneId: document.milestoneId,
    milestoneTitle: document.milestone?.title ?? null,
    name: document.name,
    type: document.type,
    fileName: document.fileName,
    filePath: document.filePath,
    fileUrl: document.filePath ? await createSignedFileUrl(document.filePath) : document.externalUrl,
    externalUrl: document.externalUrl,
    mimeType: document.mimeType,
    fileSize: document.fileSize,
    version: document.version,
    visibleToClient: document.visibleToClient,
    createdAt: dateTime(document.createdAt),
    updatedAt: dateTime(document.updatedAt),
  };
}

async function mapClientMilestone(milestone: {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: MilestoneStatusValue;
  expectedDate: Date | null;
  completionDate: Date | null;
  progress: number;
  createdAt: Date;
  project: { name: string };
  deliverables: {
    id: string;
    clientId: string;
    projectId: string | null;
    milestoneId: string | null;
    name: string;
    type: ProjectDocumentTypeValue;
    fileName: string | null;
    filePath: string | null;
    externalUrl: string | null;
    mimeType: string | null;
    fileSize: number | null;
    version: number;
    visibleToClient: boolean;
    createdAt: Date;
    updatedAt: Date;
    project?: { name: string } | null;
    milestone?: { title: string } | null;
  }[];
}): Promise<ClientMilestoneRecord> {
  return {
    id: milestone.id,
    projectId: milestone.projectId,
    projectName: milestone.project.name,
    title: milestone.title,
    description: milestone.description,
    status: milestone.status,
    expectedDate: dateOnly(milestone.expectedDate),
    completionDate: dateOnly(milestone.completionDate),
    progress: milestone.progress,
    createdAt: dateTime(milestone.createdAt),
    deliverables: await Promise.all(milestone.deliverables.map(mapProjectDocument)),
  };
}

function mapMeeting(meeting: {
  id: string;
  clientId: string;
  title: string;
  agenda: string | null;
  scheduledAt: Date;
  durationMinutes: number;
  participants: string | null;
  meetingLink: string | null;
  status: MeetingStatusValue;
  createdAt: Date;
  client?: { fullName: string | null; email: string } | null;
}): MeetingRecord {
  return {
    id: meeting.id,
    clientId: meeting.clientId,
    clientName: meeting.client ? clientLabel(meeting.client) : undefined,
    clientEmail: meeting.client?.email,
    title: meeting.title,
    agenda: meeting.agenda,
    scheduledAt: dateTime(meeting.scheduledAt),
    durationMinutes: meeting.durationMinutes,
    participants: meeting.participants,
    meetingLink: meeting.meetingLink,
    status: meeting.status,
    createdAt: dateTime(meeting.createdAt),
  };
}

async function mapPortalMessage(message: {
  id: string;
  clientId: string;
  senderId: string;
  body: string;
  attachmentName: string | null;
  attachmentPath: string | null;
  createdAt: Date;
  sender: { fullName: string | null; email: string; role: 'admin' | 'client' };
}): Promise<PortalMessageRecord> {
  return {
    id: message.id,
    clientId: message.clientId,
    senderId: message.senderId,
    senderName: clientLabel(message.sender),
    senderEmail: message.sender.email,
    senderRole: message.sender.role,
    body: message.body,
    attachmentName: message.attachmentName,
    attachmentUrl: await createSignedFileUrl(message.attachmentPath),
    createdAt: dateTime(message.createdAt),
  };
}

async function getTimelinePortalMessages(clientId: string): Promise<PortalMessageRecord[]> {
  try {
    const [profile, events] = await Promise.all([
      prisma.profile.findUnique({
        where: { id: clientId },
        select: { fullName: true, email: true },
      }),
      prisma.timelineEvent.findMany({
        where: { clientId, title: 'Client message' },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    const sender = profile ?? { fullName: null, email: 'Client' };
    return events.map((event) => ({
      id: `timeline-${event.id}`,
      clientId: event.clientId,
      senderId: event.clientId,
      senderName: clientLabel(sender),
      senderEmail: sender.email,
      senderRole: 'client',
      body: event.description ?? '',
      attachmentName: null,
      attachmentUrl: null,
      createdAt: dateTime(event.createdAt),
    }));
  } catch (error) {
    console.error('[portal-data] getTimelinePortalMessages failed', error);
    return [];
  }
}

function mapChangeRequest(changeRequest: {
  id: string;
  clientId: string;
  projectId: string | null;
  title: string;
  description: string;
  impact: ChangeImpactValue;
  estimatedCost: Prisma.Decimal;
  timelineImpact: string | null;
  status: ChangeRequestStatusValue;
  priority: ChangePriorityValue;
  adminNote: string | null;
  createdAt: Date;
  updatedAt: Date;
  project?: { name: string } | null;
}): ChangeRequestRecord {
  return {
    id: changeRequest.id,
    clientId: changeRequest.clientId,
    projectId: changeRequest.projectId,
    projectName: changeRequest.project?.name ?? null,
    title: changeRequest.title,
    description: changeRequest.description,
    impact: changeRequest.impact,
    estimatedCost: Number(changeRequest.estimatedCost),
    timelineImpact: changeRequest.timelineImpact,
    status: changeRequest.status,
    priority: changeRequest.priority,
    adminNote: changeRequest.adminNote,
    createdAt: dateTime(changeRequest.createdAt),
    updatedAt: dateTime(changeRequest.updatedAt),
  };
}

export function isPaymentStatus(value: string | undefined): value is PaymentStatusValue {
  return paymentStatuses.includes(value as PaymentStatusValue);
}

export function isTimelineEventType(value: string | undefined): value is TimelineEventTypeValue {
  return timelineEventTypes.includes(value as TimelineEventTypeValue);
}

export function isTimelineEventStatus(value: string | undefined): value is TimelineEventStatusValue {
  return timelineEventStatuses.includes(value as TimelineEventStatusValue);
}

export function isMeetingStatus(value: string | undefined): value is MeetingStatusValue {
  return meetingStatuses.includes(value as MeetingStatusValue);
}

export function isChangeImpact(value: string | undefined): value is ChangeImpactValue {
  return changeImpacts.includes(value as ChangeImpactValue);
}

export function isChangePriority(value: string | undefined): value is ChangePriorityValue {
  return changePriorities.includes(value as ChangePriorityValue);
}

export function isProjectDocumentType(value: string | undefined): value is ProjectDocumentTypeValue {
  return projectDocumentTypes.includes(value as ProjectDocumentTypeValue);
}

export async function getAdminClients(): Promise<AdminClientRecord[]> {
  const clients = await prisma.profile.findMany({
    where: { role: 'client' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      fullName: true,
      company: true,
      phone: true,
      gender: true,
      age: true,
      website: true,
      instagram: true,
      linkedin: true,
      street: true,
      city: true,
      state: true,
      postalCode: true,
      country: true,
      gstNumber: true,
      bpitNumber: true,
      emailNotifications: true,
      weeklySummary: true,
      twoFactorEnabled: true,
      createdAt: true,
      _count: { select: { payments: true, timeline: true } },
    },
  });

  return clients.map(mapClientProfile);
}

export async function getClientProfile(clientId: string): Promise<ClientProfileRecord> {
  const profile = await prisma.profile.findUniqueOrThrow({
    where: { id: clientId },
    select: {
      id: true,
      email: true,
      fullName: true,
      company: true,
      phone: true,
      gender: true,
      age: true,
      website: true,
      instagram: true,
      linkedin: true,
      street: true,
      city: true,
      state: true,
      postalCode: true,
      country: true,
      gstNumber: true,
      bpitNumber: true,
      emailNotifications: true,
      weeklySummary: true,
      twoFactorEnabled: true,
      createdAt: true,
    },
  });

  const mapped = mapClientProfile(profile);
  return {
    id: mapped.id,
    email: mapped.email,
    fullName: mapped.fullName,
    company: mapped.company,
    phone: mapped.phone,
    gender: mapped.gender,
    age: mapped.age,
    website: mapped.website,
    instagram: mapped.instagram,
    linkedin: mapped.linkedin,
    street: mapped.street,
    city: mapped.city,
    state: mapped.state,
    postalCode: mapped.postalCode,
    country: mapped.country,
    gstNumber: mapped.gstNumber,
    bpitNumber: mapped.bpitNumber,
    emailNotifications: mapped.emailNotifications,
    weeklySummary: mapped.weeklySummary,
    twoFactorEnabled: mapped.twoFactorEnabled,
    createdAt: mapped.createdAt,
  };
}

export async function getAdminPayments(filters: {
  clientId?: string;
  status?: PaymentStatusValue;
} = {}): Promise<AdminPaymentRecord[]> {
  const where: Prisma.PaymentWhereInput = {};
  if (filters.clientId) where.clientId = filters.clientId;
  if (filters.status) where.status = filters.status;

  const payments = await prisma.payment.findMany({
    where,
    include: {
      client: { select: { fullName: true, email: true } },
      proofs: { orderBy: { createdAt: 'desc' }, take: 3 },
    },
    orderBy: [{ dueDate: 'desc' }, { createdAt: 'desc' }],
  });

  return Promise.all(payments.map(async (payment) => {
    const mapped = mapAdminPayment(payment);
    mapped.proofs = await mapPaymentProofs(payment.proofs);
    return mapped;
  }));
}

export async function getClientPayments(clientId: string): Promise<ClientPaymentRecord[]> {
  const payments = await prisma.payment.findMany({
    where: { clientId },
    include: { proofs: { orderBy: { createdAt: 'desc' } } },
    orderBy: [{ dueDate: 'desc' }, { createdAt: 'desc' }],
  });

  return Promise.all(payments.map(async (payment) => ({
    id: payment.id,
    clientId: payment.clientId,
    title: payment.title,
    amount: Number(payment.amount),
    currency: payment.currency,
    status: payment.status,
    dueDate: dateOnly(payment.dueDate),
    paidAt: payment.paidAt ? dateTime(payment.paidAt) : null,
    notes: payment.notes,
    createdAt: dateTime(payment.createdAt),
    proofs: await mapPaymentProofs(payment.proofs),
  })));
}

export async function getPaymentSettings(): Promise<PaymentSettingsRecord> {
  const settings = await prisma.paymentSettings.findUnique({ where: { id: 'default' } });
  if (!settings) {
    return { upiId: null, receiverName: null, qrCodePath: null, qrCodeUrl: null, updatedAt: null };
  }

  return {
    upiId: settings.upiId,
    receiverName: settings.receiverName,
    qrCodePath: settings.qrCodePath,
    qrCodeUrl: settings.qrCodePath ? await createSignedFileUrl(settings.qrCodePath) : settings.qrCodeUrl,
    updatedAt: dateTime(settings.updatedAt),
  };
}

export async function getClientVerificationDocuments(clientId: string): Promise<VerificationDocumentRecord[]> {
  const documents = await prisma.verificationDocument.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
  });

  return Promise.all(documents.map(async (document) => ({
    id: document.id,
    clientId: document.clientId,
    documentType: document.documentType,
    documentNumber: document.documentNumber,
    fileName: document.fileName,
    filePath: document.filePath,
    fileUrl: await createSignedFileUrl(document.filePath),
    mimeType: document.mimeType,
    fileSize: document.fileSize,
    status: document.status,
    rejectionReason: document.rejectionReason,
    verifiedAt: document.verifiedAt ? dateTime(document.verifiedAt) : null,
    createdAt: dateTime(document.createdAt),
  })));
}

export async function getAdminVerificationDocuments(): Promise<VerificationDocumentRecord[]> {
  const documents = await prisma.verificationDocument.findMany({
    include: { client: { select: { fullName: true, email: true } } },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
  });

  return Promise.all(documents.map(async (document) => ({
    id: document.id,
    clientId: document.clientId,
    clientName: clientLabel(document.client),
    clientEmail: document.client.email,
    documentType: document.documentType,
    documentNumber: document.documentNumber,
    fileName: document.fileName,
    filePath: document.filePath,
    fileUrl: await createSignedFileUrl(document.filePath),
    mimeType: document.mimeType,
    fileSize: document.fileSize,
    status: document.status,
    rejectionReason: document.rejectionReason,
    verifiedAt: document.verifiedAt ? dateTime(document.verifiedAt) : null,
    createdAt: dateTime(document.createdAt),
  })));
}

export async function getAdminTimelineEvents(filters: {
  clientId?: string;
  type?: TimelineEventTypeValue;
  status?: TimelineEventStatusValue;
} = {}): Promise<AdminTimelineEventRecord[]> {
  const where: Prisma.TimelineEventWhereInput = {};
  if (filters.clientId) where.clientId = filters.clientId;
  if (filters.type) where.type = filters.type;
  if (filters.status) where.status = filters.status;

  const events = await prisma.timelineEvent.findMany({
    where,
    include: { client: { select: { fullName: true, email: true } } },
    orderBy: [{ eventDate: 'desc' }, { createdAt: 'desc' }],
  });

  return events.map(mapAdminTimelineEvent);
}

export async function getClientTimelineEvents(clientId: string): Promise<ClientTimelineEventRecord[]> {
  const events = await prisma.timelineEvent.findMany({
    where: { clientId, visibleToClient: true },
    orderBy: [{ eventDate: 'desc' }, { createdAt: 'desc' }],
  });

  return events.map((event) => ({
    id: event.id,
    clientId: event.clientId,
    title: event.title,
    description: event.description,
    type: event.type,
    eventDate: dateTime(event.eventDate),
    status: event.status,
    visibleToClient: event.visibleToClient,
    createdAt: dateTime(event.createdAt),
  }));
}

export async function getClientProjects(clientId: string): Promise<ClientProjectRecord[]> {
  return safeWorkspaceQuery('getClientProjects', async () => {
    const projects = await prisma.project.findMany({
      where: { clientId, visibleToClient: true },
      orderBy: [{ expectedCompletion: 'asc' }, { createdAt: 'desc' }],
      include: { _count: { select: { milestones: true, documents: true, changeRequests: true } } },
    });

    return projects.map(mapClientProject);
  }, []);
}

export async function getClientMilestones(clientId: string): Promise<ClientMilestoneRecord[]> {
  return safeWorkspaceQuery('getClientMilestones', async () => {
    const milestones = await prisma.milestone.findMany({
      where: { project: { clientId, visibleToClient: true } },
      orderBy: [{ expectedDate: 'asc' }, { createdAt: 'desc' }],
      include: {
        project: { select: { name: true } },
        deliverables: {
          where: { visibleToClient: true },
          include: { project: { select: { name: true } }, milestone: { select: { title: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return Promise.all(milestones.map(mapClientMilestone));
  }, []);
}

export async function getClientProjectDocuments(clientId: string): Promise<ProjectDocumentRecord[]> {
  return safeWorkspaceQuery('getClientProjectDocuments', async () => {
    const documents = await prisma.projectDocument.findMany({
      where: { clientId, visibleToClient: true },
      include: { project: { select: { name: true } }, milestone: { select: { title: true } } },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return Promise.all(documents.map(mapProjectDocument));
  }, []);
}

export async function getClientMeetings(clientId: string): Promise<MeetingRecord[]> {
  return safeWorkspaceQuery('getClientMeetings', async () => {
    const meetings = await prisma.meeting.findMany({
      where: { clientId },
      orderBy: { scheduledAt: 'desc' },
    });

    return meetings.map(mapMeeting);
  }, []);
}

export async function getAdminMeetings(): Promise<MeetingRecord[]> {
  return safeWorkspaceQuery('getAdminMeetings', async () => {
    const meetings = await prisma.meeting.findMany({
      include: { client: { select: { fullName: true, email: true } } },
      orderBy: { scheduledAt: 'desc' },
    });

    return meetings.map(mapMeeting);
  }, []);
}

export async function getClientPortalMessages(clientId: string): Promise<PortalMessageRecord[]> {
  const fallbackMessages = await getTimelinePortalMessages(clientId);
  const portalMessages = await safeWorkspaceQuery('getClientPortalMessages', async () => {
    const messages = await prisma.portalMessage.findMany({
      where: { clientId },
      include: { sender: { select: { fullName: true, email: true, role: true } } },
      orderBy: { createdAt: 'asc' },
    });

    return Promise.all(messages.map(mapPortalMessage));
  }, []);

  return [...fallbackMessages, ...portalMessages].sort((first, second) => first.createdAt.localeCompare(second.createdAt));
}

export async function getClientChangeRequests(clientId: string): Promise<ChangeRequestRecord[]> {
  return safeWorkspaceQuery('getClientChangeRequests', async () => {
    const changeRequests = await prisma.changeRequest.findMany({
      where: { clientId },
      include: { project: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return changeRequests.map(mapChangeRequest);
  }, []);
}

export async function getClientReportsData(clientId: string): Promise<ClientReportsRecord> {
  const [projects, payments, changeRequests] = await Promise.all([
    getClientProjects(clientId),
    prisma.payment.findMany({ where: { clientId } }),
    getClientChangeRequests(clientId),
  ]);

  const activeProjects = projects.filter((project) => project.status === 'active' || project.status === 'on_hold');
  const completedProjects = projects.filter((project) => project.status === 'completed');
  const paidPayments = payments.filter((payment) => payment.status === 'paid');
  const outstandingPayments = payments.filter((payment) => payment.status === 'pending' || payment.status === 'overdue');

  return {
    projects: {
      total: projects.length,
      active: activeProjects.length,
      completed: completedProjects.length,
      averageProgress: projects.length === 0 ? 0 : Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length),
      totalBudget: projects.reduce((sum, project) => sum + project.budget, 0),
      totalSpent: projects.reduce((sum, project) => sum + project.spent, 0),
    },
    payments: {
      paid: paidPayments.reduce((sum, payment) => sum + Number(payment.amount), 0),
      outstanding: outstandingPayments.reduce((sum, payment) => sum + Number(payment.amount), 0),
      overdueCount: payments.filter((payment) => payment.status === 'overdue').length,
    },
    changeRequests: {
      total: changeRequests.length,
      pending: changeRequests.filter((changeRequest) => changeRequest.status === 'pending').length,
      approved: changeRequests.filter((changeRequest) => changeRequest.status === 'approved').length,
      rejected: changeRequests.filter((changeRequest) => changeRequest.status === 'rejected').length,
    },
    projectRows: projects,
  };
}

export async function getClientDashboardData(clientId: string): Promise<ClientDashboardRecord> {
  const [profile, payments, visibleTimeline, recentTimeline] = await Promise.all([
    getClientProfile(clientId),
    prisma.payment.findMany({ where: { clientId } }),
    prisma.timelineEvent.findMany({ where: { clientId, visibleToClient: true } }),
    getClientTimelineEvents(clientId),
  ]);

  const pendingPayments = payments.filter((payment) => payment.status === 'pending');
  const overduePayments = payments.filter((payment) => payment.status === 'overdue');

  return {
    profile,
    payments: {
      total: payments.length,
      paid: payments.filter((payment) => payment.status === 'paid').length,
      pending: pendingPayments.length,
      overdue: overduePayments.length,
      cancelled: payments.filter((payment) => payment.status === 'cancelled').length,
      outstandingAmount: [...pendingPayments, ...overduePayments].reduce((sum, payment) => sum + Number(payment.amount), 0),
    },
    timeline: {
      totalVisible: visibleTimeline.length,
      upcoming: visibleTimeline.filter((event) => event.status === 'upcoming').length,
      completed: visibleTimeline.filter((event) => event.status === 'completed').length,
      recent: recentTimeline.slice(0, 5),
    },
  };
}

export async function getAdminDashboardData() {
  const [totalClients, pendingPayments, overduePayments, paymentTotal, timelineEvents, recentPayments, recentTimelineEvents] = await Promise.all([
    prisma.profile.count({ where: { role: 'client' } }),
    prisma.payment.count({ where: { status: 'pending' } }),
    prisma.payment.count({ where: { status: 'overdue' } }),
    prisma.payment.aggregate({ where: { status: { in: ['pending', 'overdue'] } }, _sum: { amount: true } }),
    prisma.timelineEvent.count(),
    prisma.payment.findMany({
      take: 5,
      include: { client: { select: { fullName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.timelineEvent.findMany({
      take: 5,
      include: { client: { select: { fullName: true, email: true } } },
      orderBy: { eventDate: 'desc' },
    }),
  ]);

  return {
    totalClients,
    pendingPayments,
    overduePayments,
    outstandingAmount: Number(paymentTotal._sum.amount ?? 0),
    timelineEvents,
    recentPayments: recentPayments.map(mapAdminPayment),
    recentTimelineEvents: recentTimelineEvents.map(mapAdminTimelineEvent),
  };
}
