import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CollapsibleHeaderSectionProps {
  collapsed: boolean;
  children: ReactNode;
  className?: string;
}

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
