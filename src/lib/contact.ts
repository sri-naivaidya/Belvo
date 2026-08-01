export const COMPANY_EMAIL = "contact.belvo@gmail.com";

type ContactTargets = {
  founderWhatsappNumber: string;
  instagramUrl: string;
  linkedinUrl: string;
  whatsappCommunityUrl: string;
  portfolioUrl: string;
};

export const CONTACT_TARGETS: ContactTargets = {
  founderWhatsappNumber: "",
  instagramUrl: "https://www.instagram.com/belvo_official/",
  linkedinUrl: "https://www.linkedin.com/company/126133994/admin/dashboard/",
  whatsappCommunityUrl: "https://chat.whatsapp.com/EoicXUyjXfD9Zvy47ursid?s=sh&p=a&ilr=4",
  portfolioUrl: "",
};

export type SubmissionKind = "career-application" | "free-call";

type SubmissionRecord = {
  id: string;
  type: SubmissionKind;
  createdAt: string;
  payload: Record<string, string>;
};

const STORAGE_KEY = "belvo-form-submissions";

function createSubmissionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `belvo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizePayload(payload: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, String(value ?? "")]),
  );
}

export async function saveSubmission(
  type: SubmissionKind,
  payload: Record<string, unknown>
) {
  const normalized = normalizePayload(payload);

  const record = {
    type,
    fullName: normalized.fullName,
    email: normalized.email,
    company: normalized.company,
    budget: normalized.budget,
    projectType: normalized.projectType,
    message: normalized.message,
  };

  const res = await fetch("/api/book-call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Failed to save submission");
  }

  return res.json();
}

export function composeMailto(subject: string, bodyLines: string[]) {
  const body = bodyLines.filter(Boolean).join("\n");

  return `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function openEmailDraft(subject: string, bodyLines: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.location.href = composeMailto(subject, bodyLines);
}

export function openFounderWhatsAppDraft(message: string) {
  if (typeof window === "undefined" || !CONTACT_TARGETS.founderWhatsappNumber) {
    return false;
  }

  const phone = CONTACT_TARGETS.founderWhatsappNumber.replace(/[^\d]/g, "");
  if (!phone) {
    return false;
  }

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  return true;
}
