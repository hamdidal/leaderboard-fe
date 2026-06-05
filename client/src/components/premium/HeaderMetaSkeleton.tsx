import { cn } from '@/lib/utils';

interface MetaSkeletonBarProps {
  className?: string;
  width?: string;
  height?: string;
}

export function MetaSkeletonBar({
  className,
  width = '72%',
  height = '0.85rem',
}: MetaSkeletonBarProps) {
  return (
    <span
      className={cn('header-meta-skeleton', className)}
      style={{ width, height }}
      data-testid="header-meta-skeleton"
      aria-hidden
    />
  );
}

export function MetaSkeletonChip({ className }: { className?: string }) {
  return (
    <span
      className={cn('header-meta-skeleton header-meta-skeleton--chip', className)}
      data-testid="header-meta-skeleton"
      aria-hidden
    />
  );
}

export function PodiumSkeleton({ label }: { label: string }) {
  return (
    <div
      className="podium-skeleton"
      data-testid="podium-skeleton"
      aria-busy="true"
      aria-label={label}
    >
      <div className="podium-skeleton-stage">
        <div className="podium-skeleton-slot podium-skeleton-slot--2" />
        <div className="podium-skeleton-slot podium-skeleton-slot--1" />
        <div className="podium-skeleton-slot podium-skeleton-slot--3" />
      </div>
      <div className="podium-skeleton-base" aria-hidden />
    </div>
  );
}
