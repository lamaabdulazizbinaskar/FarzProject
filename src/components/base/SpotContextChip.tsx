import { useTranslation } from 'react-i18next';
import { MapPinIcon } from '../icons/UiIcons';

interface SpotContextChipProps {
  region: string;
  number: number;
}

export function SpotContextChip({ region, number }: SpotContextChipProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-5 inline-flex max-w-full items-center gap-2 self-start rounded-pill bg-pain-soft px-4 py-2 text-sm font-bold text-pain-text">
      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-pain text-xs font-bold text-white">
        {number}
      </span>
      <MapPinIcon className="h-4 w-4 flex-shrink-0" />
      <span className="truncate">{t(`bodyMap.regions.${region}`)}</span>
    </div>
  );
}
