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

/**
 * Offline board.
 *
 * The clinician board normally reads from the Express service. On a static
 * deployment (and whenever the service is down) there is nothing to read, so
 * the board falls back to this browser-local store: an intake submitted in one
 * tab shows up on the board in another tab of the same browser. It keeps the
 * demo whole without pretending to be a real shared backend — the board says
 * so on screen, and entries expire on the same four-hour clock as the server.
 */
const LOCAL_KEY = 'farz_local_board';
const MAX_AGE_MS = 4 * 60 * 60 * 1000;

let servedLocally = false;

/** True when the last board read came from this browser, not the server. */
export function isOfflineBoard(): boolean {
  return servedLocally;
}

function readLocal(): DashboardEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    const list: DashboardEntry[] = raw ? JSON.parse(raw) : [];
    const fresh = list.filter((e) => Date.now() - e.createdAt < MAX_AGE_MS);
    if (fresh.length !== list.length) writeLocal(fresh);
    return fresh;
  } catch {
    return [];
  }
}

function writeLocal(list: DashboardEntry[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  } catch {
    // Private mode or quota — the board simply stays empty.
  }
}



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

export async function submitSession(payload: SubmissionPayload): Promise<{ id: string }> {
  try {
    return await request<{ id: string }>('/api/sessions', { method: 'POST', body: JSON.stringify(payload) });
  } catch (err) {
    if (!(err instanceof ApiUnavailableError)) throw err;
    const id = `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    writeLocal([...readLocal(), { ...payload, id, createdAt: Date.now(), seen: false }]);
    return { id };
  }
}

export async function fetchSessions(): Promise<DashboardEntry[]> {
  try {
    const list = await request<DashboardEntry[]>('/api/sessions');
    servedLocally = false;
    return list;
  } catch (err) {
    if (!(err instanceof ApiUnavailableError)) throw err;
    servedLocally = true;
    return readLocal();
  }
}

export async function markSessionSeen(id: string, seen: boolean): Promise<void> {
  try {
    await request(`/api/sessions/${id}`, { method: 'PATCH', body: JSON.stringify({ seen }) });
  } catch (err) {
    if (!(err instanceof ApiUnavailableError)) throw err;
    writeLocal(readLocal().map((e) => (e.id === id ? { ...e, seen } : e)));
  }
}

export async function deleteSession(id: string): Promise<void> {
  try {
    await request(`/api/sessions/${id}`, { method: 'DELETE' });
  } catch (err) {
    if (!(err instanceof ApiUnavailableError)) throw err;
    writeLocal(readLocal().filter((e) => e.id !== id));
  }
}
