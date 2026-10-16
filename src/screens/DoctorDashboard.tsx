import { useEffect, useState, useCallback } from 'react';
import i18n, { isRtl } from '../i18n';
import { fetchSessions, markSessionSeen, deleteSession, isOfflineBoard, type DashboardEntry } from '../api';
import { clinicalFields } from '../utils/clinicalText';
import { ClinicalFieldGrid } from '../components/base/ClinicalFieldGrid';
import { Avatar } from '../components/base/Avatar';
import { TriageBadge } from '../components/base/TriageBadge';
import { TRIAGE_STYLES, TRIAGE_LEVELS, type TriageLevel } from '../utils/triage';
import { FACILITY, PRODUCT } from '../config/facility';
import { AlertIcon, CheckIcon, DashboardIcon } from '../components/icons/UiIcons';
import type { Language } from '../types';

const DOCTOR_LANGS: Language[] = ['ar', 'en'];
const LANG_STORAGE_KEY = 'wdih_dashboard_lang';
const POLL_MS = 4000;

function loadLang(): Language {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language | null;
    return saved && DOCTOR_LANGS.includes(saved) ? saved : 'en';
  } catch {
    return 'en';
  }
}

function waitingFor(tf: (key: string, opts?: Record<string, unknown>) => string, createdAt: number): string {
  const minutes = Math.floor((Date.now() - createdAt) / 60_000);
  if (minutes < 1) return tf('dashboard.justNow');
  if (minutes < 60) return tf('dashboard.minutesAgo', { count: minutes });
  return tf('dashboard.hoursAgo', { count: Math.floor(minutes / 60) });
}

function QueueRow({
  entry,
  position,
  lang,
  onToggleSeen,
  onDismiss,
}: {
  entry: DashboardEntry;
  position: number;
  lang: Language;
  onToggleSeen: (entry: DashboardEntry) => void;
  onDismiss: (entry: DashboardEntry) => void;
}) {
  const tf = i18n.getFixedT(lang, 'translation');
  // Emergent cases open by default — staff shouldn't have to click to see them.
  const [expanded, setExpanded] = useState(entry.triageLevel <= 2);
  const styles = TRIAGE_STYLES[entry.triageLevel];

  return (
    <li
      className={`overflow-hidden rounded-md border border-slate-300 border-s-4 bg-white shadow-sm transition-shadow duration-150 hover:shadow-md ${
        styles.accent
      } ${entry.seen ? 'opacity-55' : ''}`}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-start sm:px-5"
      >
        <span className="w-6 shrink-0 font-mono text-sm font-bold tabular-nums text-slate-400">{position}</span>
        <Avatar tone={entry.triageLevel <= 3 ? 'alert' : 'blue'} />

        <span className="flex min-w-[9rem] flex-col leading-tight">
          <span className="font-mono text-sm font-bold tracking-wider tabular-nums text-slate-900">
            {entry.visitRef || '—'}
          </span>
          <span className="text-xs text-slate-500">
            {tf(`doctor.patientType.${entry.patientType}`)}
            {entry.companionRelation ? ` · ${tf(`patientType.relation.${entry.companionRelation}`)}` : ''}
          </span>
        </span>

        <TriageBadge level={entry.triageLevel} lang={lang} size="sm" />

        <span className="text-xs font-semibold text-slate-400">
          {tf('dashboard.spotsCount', { count: entry.spots.length })}
        </span>

        <span className="ms-auto flex flex-col items-end leading-tight">
          <span className="text-sm font-bold tabular-nums text-slate-700">{waitingFor(tf, entry.createdAt)}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400">{tf('dashboard.waiting')}</span>
        </span>
      </button>

      {expanded && (
        <div className="border-t border-slate-200 px-4 py-3 sm:px-5">
          {entry.triageReasonKeys?.length > 0 && (
            <div className="mb-3 rounded-md bg-slate-50 px-3 py-2">
              <p className="text-xs text-slate-600">
                <span className="font-semibold">{tf('triage.basedOn')}:</span>{' '}
                {entry.triageReasonKeys.map((k) => tf(k)).join(' · ')}
              </p>
            </div>
          )}

          <ol className="flex flex-col divide-y divide-slate-200">
            {entry.spots.map((spot, i) => (
              <li key={spot.id} className="py-2.5 first:pt-0 last:pb-0">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {tf('doctor.spot', { number: i + 1 })}
                </p>
                <ClinicalFieldGrid fields={clinicalFields(spot, lang)} />
              </li>
            ))}
          </ol>

          {entry.extras.length > 0 && (
            <div className="mt-3 border-t border-dashed border-slate-200 pt-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{tf('doctor.extras')}</p>
              <p className="text-sm font-semibold text-slate-800">
                {entry.extras.map((e) => tf(`extras.options.${e}`)).join(', ')}
              </p>
            </div>
          )}

          <p className="mt-3 text-[11px] italic text-slate-400">{tf('triage.disclaimer')}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onToggleSeen(entry)}
              className="flex min-h-[40px] items-center gap-1.5 rounded-pill border-2 border-border px-4 text-sm font-semibold text-text transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
            >
              <CheckIcon className="h-4 w-4" />
              {tf(entry.seen ? 'dashboard.markUnseen' : 'dashboard.markSeen')}
            </button>
            <button
              type="button"
              onClick={() => onDismiss(entry)}
              className="flex min-h-[40px] items-center rounded-pill border-2 border-border px-4 text-sm font-semibold text-text-muted transition-colors hover:border-alert hover:bg-alert-soft hover:text-alert"
            >
              {tf('dashboard.dismiss')}
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

export function DoctorDashboard() {
  const [lang, setLang] = useState<Language>(loadLang);
  const [entries, setEntries] = useState<DashboardEntry[]>([]);
  const [offline, setOffline] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const tf = i18n.getFixedT(lang, 'translation');
  const dir = isRtl(lang) ? 'rtl' : 'ltr';

  const refresh = useCallback(async () => {
    const list = await fetchSessions();
    // The server already orders by acuity then wait time; re-sort defensively
    // so the board stays correct even against an older server build.
    list.sort((a, b) => a.triageLevel - b.triageLevel || a.createdAt - b.createdAt);
    setEntries(list);
    setOffline(isOfflineBoard());
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(() => {
      refresh();
      setNow(Date.now());
    }, POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const handleToggleSeen = async (entry: DashboardEntry) => {
    setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, seen: !e.seen } : e)));
    try {
      await markSessionSeen(entry.id, !entry.seen);
    } catch {
      refresh();
    }
  };

  const handleDismiss = async (entry: DashboardEntry) => {
    setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    try {
      await deleteSession(entry.id);
    } catch {
      refresh();
    }
  };

  const counts = TRIAGE_LEVELS.reduce<Record<TriageLevel, number>>(
    (acc, level) => {
      acc[level] = entries.filter((e) => e.triageLevel === level && !e.seen).length;
      return acc;
    },
    { 2: 0, 3: 0, 4: 0, 5: 0 },
  );
  const urgentCount = counts[2] + counts[3];
  const longestWaitMin = entries.length
    ? Math.floor((now - Math.min(...entries.map((e) => e.createdAt))) / 60_000)
    : 0;

  return (
    <div dir={dir} className="min-h-screen bg-slate-100">
      {/* Facility letterhead — this board stands in for a ward display */}
      <header className="border-b-2 border-blue-600 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded bg-blue-600 text-white">
              <DashboardIcon className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-base font-bold text-slate-900">
                {PRODUCT.nameAr} <span className="text-slate-400">·</span> {PRODUCT.nameEn}
              </p>
              <p className="text-[11px] text-slate-500">
                {FACILITY.name} · {FACILITY.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-pill border-2 border-border bg-surface p-1">
            {DOCTOR_LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`min-h-[40px] rounded-pill px-4 text-sm font-bold ${
                  lang === l ? 'bg-blue-600 text-white' : 'text-text-muted'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Acuity strip: counts per triage level, worst first */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-200 bg-slate-50 px-6 py-2.5">
          <h1 className="text-xs font-bold uppercase tracking-[0.15em] text-blue-700">{tf('dashboard.queue')}</h1>

          {TRIAGE_LEVELS.map((level) => (
            <span key={level} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <span className={`h-2.5 w-2.5 rounded-full ${TRIAGE_STYLES[level].dot}`} />
              <span className="tabular-nums">{tf(`triage.level.${level}`)}</span>
              <span className="rounded bg-white px-1.5 font-mono font-bold tabular-nums text-slate-900 ring-1 ring-slate-200">
                {counts[level]}
              </span>
            </span>
          ))}

          {offline && (
            <span className="rounded-pill bg-slate-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
              {tf('dashboard.offlineBoard')}
            </span>
          )}

          <span className="ms-auto flex items-center gap-1.5 text-xs font-bold">
            {urgentCount > 0 ? (
              <span className="flex items-center gap-1.5 rounded-pill bg-red-100 px-3 py-1 text-red-700">
                <AlertIcon className="h-3.5 w-3.5" />
                <span className="tabular-nums">{urgentCount}</span>
                {tf('dashboard.highRisk')}
              </span>
            ) : (
              <span className="rounded-pill bg-emerald-100 px-3 py-1 text-emerald-700">{tf('dashboard.noUrgent')}</span>
            )}
            {entries.length > 0 && (
              <span className="rounded-pill bg-white px-3 py-1 text-slate-600 ring-1 ring-slate-200">
                {tf('dashboard.longestWait', { count: longestWaitMin })}
              </span>
            )}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-6">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <DashboardIcon className="h-10 w-10 text-slate-300" />
            <p className="text-lg font-medium text-slate-400">{tf('dashboard.empty')}</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {entries.map((entry, i) => (
              <QueueRow
                key={entry.id}
                entry={entry}
                position={i + 1}
                lang={lang}
                onToggleSeen={handleToggleSeen}
                onDismiss={handleDismiss}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
