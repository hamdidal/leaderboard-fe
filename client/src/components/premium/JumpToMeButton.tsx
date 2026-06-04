import { LocateFixed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface JumpToMeButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function JumpToMeButton({ onClick, disabled = false, className }: JumpToMeButtonProps) {
  const { t } = useTranslation();
  const label = t('leaderboard.jumpToMe');

  return (
    <button
      type="button"
      className={cn(
        'design-jump-btn',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      <LocateFixed className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
