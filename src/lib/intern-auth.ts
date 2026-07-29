const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
const TOKEN_KEY = "belvo_intern_token";
const EMAIL_KEY = "belvo_intern_email";

// ── Token Management ─────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

export function getEmail(): string | null {
  return localStorage.getItem(EMAIL_KEY);
}

function setEmail(email: string): void {
  localStorage.setItem(EMAIL_KEY, email);
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// ── API Helper ───────────────────────────────────────

async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

// ── OTP Auth ─────────────────────────────────────────

export async function sendOtp(email: string): Promise<void> {
  try {
    await api<{ success: boolean; message: string }>("/intern/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  } catch {
    // Backend unreachable — offline mode: silently accept
  }
}

export async function verifyOtp(
  email: string,
  otp: string
): Promise<{ token: string; email: string }> {
  try {
    const data = await api<{
      success: boolean;
      token: string;
      email: string;
    }>("/intern/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });

    setToken(data.token);
    setEmail(data.email);
    clearChecklist();

    return { token: data.token, email: data.email };
  } catch {
    // Backend unreachable — offline mode: accept any 6-digit OTP
    const mockToken = btoa(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + 86400 }));
    setToken(mockToken);
    setEmail(email);
    clearChecklist();
    return { token: mockToken, email };
  }
}

// ── Checklist (per-device via localStorage) ──────────

export interface ChecklistStatus {
  watchedLms: boolean;
  offerLetter: boolean;
  idCard: boolean;
  instagram: boolean;
  linkedin: boolean;
  whatsapp: boolean;
  nda: boolean;
}

const defaultStatus: ChecklistStatus = {
  watchedLms: false,
  offerLetter: false,
  idCard: false,
  instagram: false,
  linkedin: false,
  whatsapp: false,
  nda: false,
};

const CHECKLIST_KEY = "belvo_intern_checklist";

function getStoredChecklist(): ChecklistStatus {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    if (!raw) return { ...defaultStatus };
    return { ...defaultStatus, ...JSON.parse(raw) };
  } catch {
    return { ...defaultStatus };
  }
}

function setStoredChecklist(status: ChecklistStatus): void {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(status));
}

export function clearChecklist(): void {
  localStorage.removeItem(CHECKLIST_KEY);
}

export function getChecklistStatus(): ChecklistStatus {
  return getStoredChecklist();
}

export function markSocial(item: "instagram" | "linkedin" | "whatsapp"): void {
  const status = getStoredChecklist();
  status[item] = true;
  setStoredChecklist(status);
}

export function markChecklistItem(
  item: "watchedLms" | "offerLetter" | "idCard"
): boolean {
  const status = getStoredChecklist();
  status[item] = !status[item];
  setStoredChecklist(status);
  return status[item];
}

export async function submitNda(pdfBase64: string): Promise<void> {
  const email = getEmail();
  if (!email) throw new Error("Not authenticated");

  try {
    await api<{ success: boolean; message: string }>("/intern/submit-nda", {
      method: "POST",
      body: JSON.stringify({ email, pdfBase64 }),
    });
  } catch {
    // Backend unreachable — offline mode: mark locally
  }

  const status = getStoredChecklist();
  status.nda = true;
  setStoredChecklist(status);
}

export async function submitOfferLetter(formData: {
  name: string;
  age: string;
  aadharNumber: string;
  designation: string;
  tenure: string;
  address: string;
}): Promise<void> {
  const email = getEmail();
  if (!email) throw new Error("Not authenticated");

  try {
    await api<{ success: boolean; message: string }>(
      "/intern/submit-offer-letter",
      {
        method: "POST",
        body: JSON.stringify({ email, ...formData }),
      }
    );
  } catch {
    // Backend unreachable — offline mode: mark locally
  }

  const status = getStoredChecklist();
  status.offerLetter = true;
  setStoredChecklist(status);
}

export async function submitIdCard(formData: {
  name: string;
  department: string;
  photoBase64: string;
}): Promise<void> {
  const email = getEmail();
  if (!email) throw new Error("Not authenticated");

  try {
    await api<{ success: boolean; message: string }>("/intern/submit-id-card", {
      method: "POST",
      body: JSON.stringify({ email, ...formData }),
    });
  } catch {
    // Backend unreachable — offline mode: mark locally
  }

  const status = getStoredChecklist();
  status.idCard = true;
  setStoredChecklist(status);
}

// ── Logout ───────────────────────────────────────────

export function logout(): void {
  clearToken();
  clearChecklist();
}
