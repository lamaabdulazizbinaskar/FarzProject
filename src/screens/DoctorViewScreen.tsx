import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n, { isRtl } from '../i18n';
import { useSessionStore } from '../state/sessionStore';
import { Button } from '../components/base/Button';
import { BodyMap } from '../components/BodyMap/BodyMap';
import { ClinicalFieldGrid } from '../components/base/ClinicalFieldGrid';
import { Avatar } from '../components/base/Avatar';
import { TriageBadge } from '../components/base/TriageBadge';
import { AlertIcon, DashboardIcon, MapPinIcon, PrintIcon, RestartIcon, SendIcon } from '../components/icons/UiIcons';
import { submitSession, ApiUnavailableError } from '../api';
import { isSessionHighRisk } from '../utils/safety';
import { assessTriage } from '../utils/triage';
import { clinicalFields } from '../utils/clinicalText';
import { FACILITY, PRODUCT } from '../config/facility';
import type { Language, PainSpot } from '../types';

const DOCTOR_LANGS: Language[] = ['ar', 'en'];

function Column({ lang, spots, extras, patientTypeLabel, title, variant }: {
  lang: Language;
  spots: PainSpot[];
  extras: string[];
  patientTypeLabel: string;
  title: string;
  variant: 'patient' | 'doctor';
}) {
  const tf = i18n.getFixedT(lang, 'translation');
  const dir = isRtl(lang) ? 'rtl' : 'ltr';

  return (
    <div
      dir={dir}
      className={`flex-1 rounded-md border bg-white shadow-sm print:shadow-none ${
        variant === 'doctor' ? 'border-slate-300 border-s-4 border-s-blue-600' : 'border-slate-300'
      }`}
    >
      <div className="flex items-center gap-2.5 border-b border-slate-200 px-4 py-2.5">
        <Avatar tone={variant === 'doctor' ? 'blue' : 'neutral'} size="md" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</h2>
      </div>

      <div className="px-4 py-3">
        <div className="mb-3 border-b border-dashed border-slate-200 pb-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{tf('doctor.patientTypeField')}</p>
          <p className="text-sm font-semibold text-slate-800">{patientTypeLabel}</p>
        </div>

        <ol className="flex flex-col divide-y divide-slate-200">
          {spots.map((spot, i) => (
            <li key={spot.id} className="py-3 first:pt-0 last:pb-0">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {tf('doctor.spot', { number: i + 1 })}
              </p>
              <ClinicalFieldGrid fields={clinicalFields(spot, lang)} />
            </li>
          ))}
        </ol>

        <div className="mt-3 border-t border-dashed border-slate-200 pt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{tf('doctor.extras')}</p>
          <p className="text-sm font-semibold text-slate-800">
            {extras.length ? extras.map((e) => tf(`extras.options.${e}`)).join(', ') : tf('doctor.noExtras')}
          </p>
        </div>
      </div>
    </div>
  );
}

export function DoctorViewScreen() {
  const { t } = useTranslation();
  const spots = useSessionStore((s) => s.spots);
  const extras = useSessionStore((s) => s.extras);
  const patientLanguage = useSessionStore((s) => s.patientLanguage) ?? 'en';
  const patientType = useSessionStore((s) => s.patientType);
  const bodyShape = useSessionStore((s) => s.bodyShape);
  const companionRelation = useSessionStore((s) => s.companionRelation);
  const doctorLanguage = useSessionStore((s) => s.doctorLanguage);
  const setDoctorLanguage = useSessionStore((s) => s.setDoctorLanguage);
  const visitRef = useSessionStore((s) => s.visitRef);
  const goBack = useSessionStore((s) => s.goBack);
  const reset = useSessionStore((s) => s.reset);

  const [confirmingReset, setConfirmingReset] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [generatedAt] = useState(() => new Date());

  const triage = assessTriage({ spots, extras });

  const handleSend = async () => {
    setSendStatus('sending');
    try {
      await submitSession({
        patientLanguage,
        patientType: patientType ?? 'self',
        companionRelation,
        spots,
        extras,
        highRisk: isSessionHighRisk({ spots, extras }),
        visitRef,
        triageLevel: triage.level,
        triageReasonKeys: triage.reasonKeys,
      });
      setSendStatus('sent');
    } catch (err) {
      setSendStatus('error');
      if (!(err instanceof ApiUnavailableError)) {
        console.error(err);
      }
    }
  };

  const frontPins = spots
    .filter((s) => s.side === 'front')
    .map((s) => ({ number: spots.indexOf(s) + 1, region: s.region, side: s.side }));
  const backPins = spots
    .filter((s) => s.side === 'back')
    .map((s) => ({ number: spots.indexOf(s) + 1, region: s.region, side: s.side }));

  const tfDoctor = i18n.getFixedT(doctorLanguage, 'translation');
  const tfPatient = i18n.getFixedT(patientLanguage, 'translation');
  const patientTypeKey = patientType ?? 'self';

  return (
    <div className="flex h-full min-h-screen flex-col bg-slate-100 print:bg-white">
      <header className="no-print flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={goBack}
          className="flex min-h-[48px] items-center rounded-pill border-2 border-border bg-surface px-5 text-sm font-semibold text-text shadow-softer"
        >
          {t('common.back')}
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="#dashboard"
            target="_blank"
            rel="noreferrer"
            aria-label={t('doctor.openDashboard')}
            className="flex min-h-[48px] items-center gap-2 whitespace-nowrap rounded-pill border-2 border-border bg-surface px-4 text-sm font-semibold text-text shadow-softer transition-all duration-150 hover:-translate-y-0.5 hover:border-primary hover:shadow-soft"
          >
            <DashboardIcon className="h-5 w-5 flex-shrink-0" />
            <span className="hidden sm:inline">{t('doctor.openDashboard')}</span>
          </a>
          <div className="flex items-center gap-2 rounded-pill border-2 border-border bg-surface p-1">
            {DOCTOR_LANGS.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setDoctorLanguage(lang)}
                aria-pressed={doctorLanguage === lang}
                className={`min-h-[40px] rounded-pill px-4 text-sm font-bold ${
                  doctorLanguage === lang ? 'bg-blue-600 text-white' : 'text-text-muted'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-5 pb-8 sm:px-8">
        <div className="overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm print:border-black">
          {/* Facility letterhead */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-blue-600 bg-slate-50 px-5 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white">
                <AlertIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold text-slate-900">{FACILITY.name}</p>
                <p className="text-[11px] uppercase tracking-wider text-slate-500">{FACILITY.department}</p>
              </div>
              <span className="hidden rounded-pill bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 sm:inline">
                {PRODUCT.nameAr} · {PRODUCT.nameEn}
              </span>
            </div>
            <div className="text-end leading-tight">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('doctor.visitRef')}</p>
              <p className="font-mono text-sm font-bold tabular-nums text-slate-900">{visitRef}</p>
            </div>
          </div>

          <div className="px-5 py-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-600">{t('doctor.formEyebrow')}</p>
            <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{t('doctor.title')}</h1>
              <p className="text-xs text-slate-400">
                {t('doctor.generated')}: {generatedAt.toLocaleString(i18n.language)}
              </p>
            </div>

            {/* Triage support — transparent, rule-based, clearly not a diagnosis */}
            <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {t('triage.title')}
                </span>
                {/* Chrome follows the UI language, like the rest of this header —
                    the AR/EN/UR toggle only switches the clinician column below. */}
                <TriageBadge level={triage.level} lang={i18n.language as Language} />
                <span className="flex items-center gap-1.5 rounded-pill bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  <MapPinIcon className="h-3.5 w-3.5" />
                  {t('dashboard.spotsCount', { count: spots.length })}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                <span className="font-semibold">{t('triage.basedOn')}:</span>{' '}
                {triage.reasonKeys.map((k) => t(k)).join(' · ')}
              </p>
              <p className="mt-1.5 text-[11px] italic text-slate-400">{t('triage.disclaimer')}</p>
            </div>
          </div>
        </div>

        {spots.length > 0 && (
          <div className="flex justify-center gap-6 rounded-md border border-slate-300 bg-white py-4 shadow-sm print:border-black" dir="ltr">
            <div className="w-28"><BodyMap side="front" shape={bodyShape} pins={frontPins} onRegionTap={() => {}} /></div>
            <div className="w-28"><BodyMap side="back" shape={bodyShape} pins={backPins} onRegionTap={() => {}} /></div>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row">
          <Column
            lang={patientLanguage}
            spots={spots}
            extras={extras}
            patientTypeLabel={`${tfPatient(`doctor.patientType.${patientTypeKey}`)}${
              companionRelation ? ` · ${tfPatient(`patientType.relation.${companionRelation}`)}` : ''
            }`}
            title={tfPatient('doctor.patientColumn')}
            variant="patient"
          />
          <Column
            lang={doctorLanguage}
            spots={spots}
            extras={extras}
            patientTypeLabel={`${tfDoctor(`doctor.patientType.${patientTypeKey}`)}${
              companionRelation ? ` · ${tfDoctor(`patientType.relation.${companionRelation}`)}` : ''
            }`}
            title={tfDoctor('doctor.doctorColumn')}
            variant="doctor"
          />
        </div>

        <div className="no-print flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="clinical"
              onClick={handleSend}
              disabled={sendStatus === 'sending'}
              icon={<SendIcon className="h-5 w-5" />}
            >
              {sendStatus === 'sending' ? t('doctor.sending') : t('doctor.sendToDashboard')}
            </Button>
            {sendStatus === 'sent' && (
              <span className="text-sm font-semibold text-blue-600">{t('doctor.sent')}</span>
            )}
            {sendStatus === 'error' && (
              <span className="text-sm font-semibold text-alert">{t('doctor.sendError')}</span>
            )}
          </div>
          <p className="text-xs text-text-muted">{t('doctor.sendNote')}</p>
        </div>

        <div className="no-print flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => window.print()} icon={<PrintIcon className="h-5 w-5" />}>
            {t('doctor.print')}
          </Button>
          {confirmingReset ? (
            <div className="flex items-center gap-3 rounded-card border-2 border-alert bg-alert-soft px-4 py-2">
              <span className="text-sm font-semibold text-alert">{t('topbar.newPatientConfirm')}</span>
              <Button variant="primary" onClick={reset}>
                {t('common.yes')}
              </Button>
              <Button variant="ghost" onClick={() => setConfirmingReset(false)}>
                {t('common.no')}
              </Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setConfirmingReset(true)} icon={<RestartIcon className="h-5 w-5" />}>
              {t('doctor.newPatient')}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
