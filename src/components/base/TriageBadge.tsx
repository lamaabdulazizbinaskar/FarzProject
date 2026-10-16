import i18n from '../../i18n';
import { TRIAGE_STYLES, type TriageLevel } from '../../utils/triage';
import type { Language } from '../../types';

interface TriageBadgeProps {
  level: TriageLevel;
  lang: Language;
  size?: 'sm' | 'md';
}

export function TriageBadge({ level, lang, size = 'md' }: TriageBadgeProps) {
  const tf = i18n.getFixedT(lang, 'translation');
  const styles = TRIAGE_STYLES[level];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md font-bold uppercase tracking-wide ring-1 ${styles.badge} ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
      <span className="tabular-nums">{tf('triage.levelShort', { level })}</span>
      <span aria-hidden="true" className="opacity-40">·</span>
      <span>{tf(`triage.level.${level}`)}</span>
    </span>
  );
}
