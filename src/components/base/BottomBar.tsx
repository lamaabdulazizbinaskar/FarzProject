import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { BackArrowIcon, ForwardArrowIcon } from '../icons/UiIcons';

interface BottomBarProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
  showNext?: boolean;
  progress?: { current: number; total: number };
}

export function BottomBar({
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
  showBack = true,
  showNext = true,
  progress,
}: BottomBarProps) {
  const { t } = useTranslation();

  return (
    <footer className="no-print flex items-center justify-between gap-3 border-t border-border bg-surface/80 px-4 py-4 backdrop-blur sm:px-6">
      <div className="min-w-[88px]">
        {showBack ? (
          <Button variant="ghost" onClick={onBack} icon={<BackArrowIcon className="h-5 w-5 rtl:rotate-180" />}>
            {t('common.back')}
          </Button>
        ) : null}
      </div>

      {progress ? (
        <div className="flex items-center gap-1.5" role="img" aria-label={`${progress.current}/${progress.total}`}>
          {Array.from({ length: progress.total }).map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i < progress.current ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>
      ) : (
        <div />
      )}

      <div className="min-w-[88px] text-end">
        {showNext ? (
          <Button variant="primary" onClick={onNext} disabled={nextDisabled}>
            <span className="flex items-center gap-2">
              {nextLabel ?? t('common.next')}
              <ForwardArrowIcon className="h-5 w-5 rtl:rotate-180" />
            </span>
          </Button>
        ) : null}
      </div>
    </footer>
  );
}
