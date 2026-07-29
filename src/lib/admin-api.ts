const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export interface TeamMember {
  id: number;
  name: string;
  team_id: string;
  team_name: string;
  responsibilities: string[];
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  color: string;
  light_color: string;
  sort_order: number;
}

export interface TeamGroup {
  id: string;
  name: string;
  color: string;
  lightColor: string;
  members: TeamMember[];
}

// ── Auth ───────────────────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem("belvo_admin_token");
}

export function setToken(token: string): void {
  localStorage.setItem("belvo_admin_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("belvo_admin_token");
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

  // Don't set Content-Type for FormData (let browser set it with boundary)
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

// ── Auth API ───────────────────────────────────────────

export async function login(username: string, password: string): Promise<string> {
  const data = await api<{ success: boolean; token: string }>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  setToken(data.token);
  return data.token;
}

// ── Team API ───────────────────────────────────────────

export async function fetchTeam(): Promise<TeamMember[]> {
  const data = await api<{ success: boolean; members: TeamMember[] }>("/api/team");
  return data.members;
}

export async function createMember(member: {
  name: string;
  teamId: string;
  teamName: string;
  responsibilities?: string[];
  sortOrder?: number;
  imageUrl?: string;
}): Promise<TeamMember> {
  const data = await api<{ success: boolean; member: TeamMember }>("/api/team", {
    method: "POST",
    body: JSON.stringify(member),
  });
  return data.member;
}

export async function updateMember(
  id: number,
  member: Partial<{
    name: string;
    teamId: string;
    teamName: string;
    responsibilities: string[];
    sortOrder: number;
    imageUrl: string;
  }>
): Promise<TeamMember> {
  const data = await api<{ success: boolean; member: TeamMember }>(`/api/team/${id}`, {
    method: "PUT",
    body: JSON.stringify(member),
  });
  return data.member;
}

export async function deleteMember(id: number): Promise<void> {
  await api<{ success: boolean }>(`/api/team/${id}`, {
    method: "DELETE",
  });
}

// ── Upload API ─────────────────────────────────────────

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const data = await api<{ success: boolean; url: string }>("/api/upload", {
    method: "POST",
    body: formData,
  });
  return data.url;
}

// ── Departments API ─────────────────────────────────────

export async function fetchDepartments(): Promise<Department[]> {
  const data = await api<{ success: boolean; departments: Department[] }>("/api/departments");
  return data.departments;
}

export async function createDepartment(dept: {
  id: string;
  name: string;
  color: string;
  lightColor?: string;
  sortOrder?: number;
}): Promise<Department> {
  const data = await api<{ success: boolean; department: Department }>("/api/departments", {
    method: "POST",
    body: JSON.stringify(dept),
  });
  return data.department;
}

export async function updateDepartment(
  id: string,
  dept: Partial<{ name: string; color: string; lightColor: string; sortOrder: number }>,
): Promise<Department> {
  const data = await api<{ success: boolean; department: Department }>(`/api/departments/${id}`, {
    method: "PUT",
    body: JSON.stringify(dept),
  });
  return data.department;
}

export async function deleteDepartment(id: string): Promise<void> {
  await api<{ success: boolean }>(`/api/departments/${id}`, {
    method: "DELETE",
  });
}

// ── Helpers ────────────────────────────────────────────

export function groupMembersByTeam(members: TeamMember[], departments: Department[]): TeamGroup[] {
  return departments.map((d) => ({
    id: d.id,
    name: d.name,
    color: d.color,
    lightColor: d.light_color,
    members: members.filter((m) => m.team_id === d.id),
  })).filter((g) => g.members.length > 0);
}

export function getImageUrl(member: TeamMember): string {
  if (member.image_url) {
    return member.image_url.startsWith("http")
      ? member.image_url
      : `${API_BASE}${member.image_url}`;
  }
  return "";
}
