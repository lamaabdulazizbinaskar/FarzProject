import { useTranslation } from 'react-i18next';
import { useSessionStore } from '../state/sessionStore';
import { TopBar } from '../components/base/TopBar';
import { BottomBar } from '../components/base/BottomBar';
import { Button } from '../components/base/Button';
import { Banner } from '../components/base/Banner';
import { BodyMap } from '../components/BodyMap/BodyMap';
import { ClinicalFieldGrid } from '../components/base/ClinicalFieldGrid';
import { isSessionHighRisk } from '../utils/safety';
import { clinicalFields } from '../utils/clinicalText';
import { PAIN_TYPE_ICONS } from '../components/icons/painTypeIconMap';
import { EXTRA_SYMPTOM_ICONS } from '../components/icons/extraTypeIconMap';
import { AlertIcon, MapPinIcon } from '../components/icons/UiIcons';
import type { Language, PainSpot } from '../types';

function SpotCard({
  spot,
  index,
  lang,
  onEdit,
}: {
  spot: PainSpot;
  index: number;
  lang: Language;
  onEdit: () => void;
}) {
  const { t } = useTranslation();
  const PrimaryIcon = PAIN_TYPE_ICONS[spot.types[0] ?? 'unknown'];

  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex w-full items-start gap-4 rounded-md border border-slate-300 border-s-4 border-s-blue-500 bg-white px-5 py-4 text-start shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
    >
      <span className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
        <PrimaryIcon className="h-6 w-6 text-blue-600" />
        <span className="absolute -bottom-1 -end-1 flex h-5 w-5 items-center justify-center rounded-full bg-pain text-[10px] font-bold text-white">
          {index + 1}
        </span>
      </span>
      <div className="flex-1">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {t('doctor.spot', { number: index + 1 })}
        </p>
        <ClinicalFieldGrid fields={clinicalFields(spot, lang)} />
      </div>
    </button>
  );
}

export function ReviewScreen() {
  const { t } = useTranslation();
  const spots = useSessionStore((s) => s.spots);
  const extras = useSessionStore((s) => s.extras);
  const bodyShape = useSessionStore((s) => s.bodyShape);
  const patientLanguage = useSessionStore((s) => s.patientLanguage) ?? 'en';
  const editSpot = useSessionStore((s) => s.editSpot);
  const setStep = useSessionStore((s) => s.setStep);
  const goBack = useSessionStore((s) => s.goBack);
  const visitRef = useSessionStore((s) => s.visitRef);

  const highRisk = isSessionHighRisk({ spots, extras });
  const frontPins = spots
    .filter((s) => s.side === 'front')
    .map((s) => ({ number: spots.indexOf(s) + 1, region: s.region, side: s.side }));
  const backPins = spots
    .filter((s) => s.side === 'back')
    .map((s) => ({ number: spots.indexOf(s) + 1, region: s.region, side: s.side }));

  const handleEdit = (id: string) => {
    editSpot(id, 'review');
    setStep('painType');
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-slate-100">
      <TopBar onLanguageClick={() => setStep('language')} />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-5 pb-4 sm:px-8">
        <div className="rounded-md border border-slate-300 bg-white px-5 py-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-600">{t('doctor.formEyebrow')}</p>
          <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">{t('review.title')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('review.subtitle')}</p>
          {spots.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-pill bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                <MapPinIcon className="h-3.5 w-3.5" />
                {t('dashboard.spotsCount', { count: spots.length })}
              </span>
              <span
                className={`flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-bold ${
                  highRisk ? 'bg-alert-soft text-alert' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <AlertIcon className="h-3.5 w-3.5" />
                {highRisk ? t('dashboard.highRisk') : t('doctor.routine')}
              </span>
            </div>
          )}

          {/* Visit reference — the patient's handle on this intake at reception */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-md border border-dashed border-blue-300 bg-blue-50/60 px-4 py-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">{t('doctor.visitRef')}</p>
              <p className="font-mono text-lg font-bold tracking-wider tabular-nums text-slate-900">{visitRef}</p>
            </div>
            <p className="text-xs font-medium text-blue-800/80">{t('review.visitRefHint')}</p>
          </div>
        </div>

        {highRisk && <Banner title={t('safety.title')} message={t('safety.message')} />}

        {spots.length > 0 && (
          <div className="flex justify-center gap-6 rounded-md border border-slate-300 bg-white py-4 shadow-sm" dir="ltr">
            <div className="w-28"><BodyMap side="front" shape={bodyShape} pins={frontPins} onRegionTap={() => {}} /></div>
            <div className="w-28"><BodyMap side="back" shape={bodyShape} pins={backPins} onRegionTap={() => {}} /></div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {spots.length === 0 ? (
            <p className="text-slate-500">{t('review.noSpots')}</p>
          ) : (
            spots.map((spot, i) => (
              <SpotCard key={spot.id} spot={spot} index={i} lang={patientLanguage} onEdit={() => handleEdit(spot.id)} />
            ))
          )}
        </div>

        {extras.length > 0 && (
          <div className="rounded-md border border-slate-300 bg-white px-5 py-4 shadow-sm">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('review.extrasTitle')}</p>
            <div className="flex flex-wrap gap-2">
              {extras.map((ex) => {
                const Icon = EXTRA_SYMPTOM_ICONS[ex];
                return (
                  <span
                    key={ex}
                    className="flex items-center gap-2 rounded-pill bg-blue-50 py-2 ps-2.5 pe-4 text-sm font-semibold text-blue-700"
                  >
                    <Icon className="h-5 w-5" />
                    {t(`extras.options.${ex}`)}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <Button variant="clinical" size="lg" onClick={() => setStep('doctor')} className="mt-2 w-full">
          {t('review.showToDoctor')}
        </Button>
      </main>
      <BottomBar onBack={goBack} showNext={false} />
    </div>
  );
}
