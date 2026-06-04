import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { CoinIcon, type CoinIconSize } from '@/components/atoms/CoinIcon/CoinIcon';
import styles from './CoinAmount.module.css';

export type CoinAmountSize = 'sm' | 'md' | 'lg';

const ICON_SIZE: Record<CoinAmountSize, CoinIconSize> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

interface CoinAmountProps {
  amount: number;
  size?: CoinAmountSize;
  className?: string;
}

export function CoinAmount({ amount, size = 'md', className }: CoinAmountProps) {
  const { i18n } = useTranslation();
  const fmt = new Intl.NumberFormat(i18n.language, {
    maximumFractionDigits: 0,
  });

  return (
    <span className={cn(styles.wrapper, styles[size], className)}>
      <CoinIcon size={ICON_SIZE[size]} />
      <span>{fmt.format(amount)}</span>
    </span>
  );
}
