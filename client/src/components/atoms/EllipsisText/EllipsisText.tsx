import { useCallback, useEffect, useRef, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface EllipsisTextProps {
  text: string;
  className?: string;
}

function readIsCoarsePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

function useIsCoarsePointer() {
  const [isCoarse, setIsCoarse] = useState(readIsCoarsePointer);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const update = () => setIsCoarse(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return isCoarse;
}

export function EllipsisText({ text, className }: EllipsisTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [open, setOpen] = useState(false);
  const isCoarsePointer = useIsCoarsePointer();

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setIsTruncated(el.scrollWidth > el.clientWidth + 1);
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, measure]);

  const tooltipOpen = isTruncated ? open : false;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      if (!isCoarsePointer || !isTruncated) return;
      e.stopPropagation();
      setOpen((v) => !v);
    },
    [isCoarsePointer, isTruncated],
  );

  const span = (
    <span
      ref={ref}
      className={cn(className, isTruncated && 'cursor-help')}
      onClick={isTruncated && isCoarsePointer ? handleClick : undefined}
    >
      {text}
    </span>
  );

  if (!isTruncated) return span;

  return (
    <Tooltip open={tooltipOpen} onOpenChange={setOpen}>
      <TooltipTrigger asChild>{span}</TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-[min(90vw,280px)] break-words text-center"
      >
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
