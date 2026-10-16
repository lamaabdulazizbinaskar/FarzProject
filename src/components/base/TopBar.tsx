import { useTranslation } from 'react-i18next';
import { useSessionStore } from '../../state/sessionStore';
import { GlobeIcon, SpeakerOffIcon, SpeakerOnIcon, TextSizeIcon } from '../icons/UiIcons';
import { JourneyStepper } from './JourneyStepper';

interface TopBarProps {
  onLanguageClick?: () => void;
  showLanguage?: boolean;
}

export function TopBar({ onLanguageClick, showLanguage = true }: TopBarProps) {
  const { t } = useTranslation();
  const audioOn = useSessionStore((s) => s.audioOn);
  const setAudioOn = useSessionStore((s) => s.setAudioOn);
  const largeMode = useSessionStore((s) => s.largeMode);
  const setLargeMode = useSessionStore((s) => s.setLargeMode);
  const patientLanguage = useSessionStore((s) => s.patientLanguage);

  return (
    <div className="no-print">
      <header className="flex items-center justify-between gap-2 px-4 pt-3 sm:px-6">
        <div className="flex items-center gap-2">
          {showLanguage && (
            <button
              type="button"
              onClick={onLanguageClick}
              aria-label={t('common.language')}
              className="flex min-h-[48px] items-center gap-2 rounded-pill border-2 border-border bg-surface px-4 text-sm font-semibold text-text shadow-softer active:scale-95"
            >
              <GlobeIcon className="h-5 w-5" />
              <span className="uppercase">{patientLanguage ?? ''}</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLargeMode(!largeMode)}
            aria-pressed={largeMode}
            aria-label={t('common.largeMode')}
            className={`flex min-h-[48px] min-w-[48px] items-center justify-center rounded-pill border-2 shadow-softer active:scale-95 ${
              largeMode ? 'border-primary bg-primary-soft text-primary' : 'border-border bg-surface text-text'
            }`}
          >
            <TextSizeIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setAudioOn(!audioOn)}
            aria-pressed={audioOn}
            aria-label={audioOn ? t('common.audioOn') : t('common.audioOff')}
            className={`flex min-h-[48px] min-w-[48px] items-center justify-center rounded-pill border-2 shadow-softer active:scale-95 ${
              audioOn ? 'border-primary bg-primary-soft text-primary' : 'border-border bg-surface text-text-muted'
            }`}
          >
            {audioOn ? <SpeakerOnIcon className="h-5 w-5" /> : <SpeakerOffIcon className="h-5 w-5" />}
          </button>
        </div>
      </header>
      <JourneyStepper />
    </div>
  );
}
