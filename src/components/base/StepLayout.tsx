import type { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { BottomBar } from './BottomBar';
import { BackgroundDecor } from './BackgroundDecor';

interface StepLayoutProps {
  animKey: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  onLanguageClick?: () => void;
  showLanguage?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
  showNext?: boolean;
  progress?: { current: number; total: number };
  wide?: boolean;
}

export function StepLayout({
  animKey,
  title,
  subtitle,
  children,
  onLanguageClick,
  showLanguage,
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
  showBack,
  showNext,
  progress,
  wide,
}: StepLayoutProps) {
  return (
    <div className="relative flex h-full min-h-screen flex-col overflow-hidden bg-bg">
      <BackgroundDecor />
      <div className="relative z-10 flex min-h-screen flex-1 flex-col">
        <TopBar onLanguageClick={onLanguageClick} showLanguage={showLanguage} />
        <main
          key={animKey}
          className={`ltr:animate-slide-in-ltr rtl:animate-slide-in-rtl mx-auto flex w-full flex-1 flex-col justify-center px-5 pb-4 sm:px-8 ${
            wide ? 'max-w-5xl' : 'max-w-2xl'
          }`}
        >
          {title ? (
            <h1 className="font-display mb-1 text-[1.5rem] font-bold leading-tight text-text sm:text-[2rem]">{title}</h1>
          ) : null}
          {subtitle ? <p className="mb-6 text-base text-text-muted sm:text-lg">{subtitle}</p> : null}
          <div>{children}</div>
        </main>
        <BottomBar
          onBack={onBack}
          onNext={onNext}
          nextLabel={nextLabel}
          nextDisabled={nextDisabled}
          showBack={showBack}
          showNext={showNext}
          progress={progress}
        />
      </div>
    </div>
  );
}
