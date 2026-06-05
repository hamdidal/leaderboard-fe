import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CollapsibleHeaderSectionProps {
  collapsed: boolean;
  children: ReactNode;
  className?: string;
}

/** CSS grid 0fr/1fr accordion — GPU-friendly, no JS height measurement. */
export function CollapsibleHeaderSection({
  collapsed,
  children,
  className,
}: CollapsibleHeaderSectionProps) {
  return (
    <div
      className={cn('header-collapse-grid', className)}
      data-collapsed={collapsed ? 'true' : 'false'}
      aria-hidden={collapsed || undefined}
    >
      <div className="header-collapse-inner">{children}</div>
    </div>
  );
}
