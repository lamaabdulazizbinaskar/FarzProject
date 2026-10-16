import type { TriageLevel } from './utils/triage';
import type { CompanionRelation, ExtraSymptom, Language, PainSpot, PatientType } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface SubmissionPayload {
  patientLanguage: Language;
  patientType: PatientType;
  companionRelation: CompanionRelation | null;
  spots: PainSpot[];
  extras: ExtraSymptom[];
  highRisk: boolean;
  visitRef: string;
  triageLevel: TriageLevel;
  triageReasonKeys: string[];
}

export interface DashboardEntry extends SubmissionPayload {
  id: string;
  createdAt: number;
  seen: boolean;
}

export class ApiUnavailableError extends Error {}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    throw new ApiUnavailableError('Could not reach the dashboard server.');
  }
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function submitSession(payload: SubmissionPayload): Promise<{ id: string }> {
  return request('/api/sessions', { method: 'POST', body: JSON.stringify(payload) });
}

export function fetchSessions(): Promise<DashboardEntry[]> {
  return request('/api/sessions');
}

export function markSessionSeen(id: string, seen: boolean): Promise<DashboardEntry> {
  return request(`/api/sessions/${id}`, { method: 'PATCH', body: JSON.stringify({ seen }) });
}

export function deleteSession(id: string): Promise<void> {
  return request(`/api/sessions/${id}`, { method: 'DELETE' });
}
