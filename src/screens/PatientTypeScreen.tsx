import { useTranslation } from 'react-i18next';
import { useSessionStore } from '../state/sessionStore';
import { StepLayout } from '../components/base/StepLayout';
import { OptionCard } from '../components/base/OptionCard';
import { useAudio } from '../hooks/useAudio';
import type { CompanionRelation, PatientType } from '../types';

const OPTIONS: PatientType[] = ['self', 'child', 'helping_someone'];
const RELATIONS: CompanionRelation[] = ['family', 'spouse', 'parent', 'friend', 'coworker', 'caregiver', 'other'];
const RELATION_EMOJI: Record<CompanionRelation, string> = {
  family: '👨‍👩‍👧',
  spouse: '💍',
  parent: '👪',
  friend: '🧑‍🤝‍🧑',
  coworker: '👷',
  caregiver: '🧑‍⚕️',
  other: '🤝',
};
const LABEL_KEY: Record<PatientType, string> = {
  self: 'patientType.self',
  child: 'patientType.child',
  helping_someone: 'patientType.helping',
};
const EMOJI: Record<PatientType, string> = {
  self: '🙋',
  child: '🧒',
  helping_someone: '🤝',
};

export function PatientTypeScreen() {
  const { t } = useTranslation();
  const patientLanguage = useSessionStore((s) => s.patientLanguage);
  const patientType = useSessionStore((s) => s.patientType);
  const setPatientType = useSessionStore((s) => s.setPatientType);
  const companionRelation = useSessionStore((s) => s.companionRelation);
  const setCompanionRelation = useSessionStore((s) => s.setCompanionRelation);
  const setStep = useSessionStore((s) => s.setStep);
  const goBack = useSessionStore((s) => s.goBack);
  const { speak } = useAudio(patientLanguage ?? 'en');

  return (
    <StepLayout
      animKey="patientType"
      title={t('patientType.title')}
      onLanguageClick={() => setStep('language')}
      onBack={goBack}
      onNext={() => setStep('bodyMap')}
      nextDisabled={!patientType}
    >
      <div className="flex flex-col gap-4">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt}
            selected={patientType === opt}
            onClick={() => {
              setPatientType(opt);
              speak(t(LABEL_KEY[opt]));
            }}
            ariaLabel={t(LABEL_KEY[opt])}
            className="flex items-center gap-3 text-xl"
          >
            <span aria-hidden="true" className="text-2xl">{EMOJI[opt]}</span>
            {t(LABEL_KEY[opt])}
          </OptionCard>
        ))}

        {/* A companion can be anyone — a relative, a workmate, a neighbour who
            drove them in. Who they are changes how the history is weighed. */}
        {patientType === 'helping_someone' && (
          <div className="animate-pop-in rounded-2xl border-2 border-primary-soft bg-primary-soft/40 p-4">
            <p className="text-sm font-bold text-primary-dark">{t('patientType.relation.title')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {RELATIONS.map((rel) => {
                const label = t(`patientType.relation.${rel}`);
                const selected = companionRelation === rel;
                return (
                  <button
                    key={rel}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setCompanionRelation(rel);
                      speak(label);
                    }}
                    className={`flex min-h-[48px] items-center gap-2 rounded-pill border-2 px-4 text-base font-semibold transition-colors ${
                      selected
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-surface text-text hover:border-primary'
                    }`}
                  >
                    <span aria-hidden="true">{RELATION_EMOJI[rel]}</span>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </StepLayout>
  );
}
