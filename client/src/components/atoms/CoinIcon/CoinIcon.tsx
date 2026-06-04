import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './CoinIcon.module.css';

export type CoinIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface CoinIconProps {
  size?: CoinIconSize;
  className?: string;
  decorative?: boolean;
  title?: string;
}

export function CoinIcon({
  size = 'md',
  className,
  decorative = true,
  title,
}: CoinIconProps) {
  return (
    <Coins
      className={cn(styles.icon, styles[size], className)}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title ?? 'Coins'}
      strokeWidth={2.25}
    />
  );
}
