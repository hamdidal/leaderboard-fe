import { useTranslation } from 'react-i18next';
import type { LatestRewardsResponse } from '@panteon/shared';
import { LAST_WEEK_SECTION_ID } from '@/lib/scrollToLastWeek';
import { WeekRewardsPanel } from './WeekRewardsPanel';

interface LastWeekSectionProps {
  data: LatestRewardsResponse;
  highlightUserId?: string;
}

export function LastWeekSection({ data, highlightUserId }: LastWeekSectionProps) {
  const { t } = useTranslation();

  return (
    <section
      id={LAST_WEEK_SECTION_ID}
      className="last-week-section scroll-mt-4 px-1 sm:px-2.5"
      aria-label={t('leaderboard.lastWeekSectionAria')}
    >
      <div className="mb-2 flex items-center justify-between gap-2 px-1.5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {t('leaderboard.lastWeekLabel')}
          </p>
          <p className="text-xs font-semibold text-foreground/80">
            {t('leaderboard.lastWeekFinalHint')}
          </p>
        </div>
        <span className="last-week-badge rounded-full border border-border/50 bg-muted/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          {t('leaderboard.lastWeekReadOnly')}
        </span>
      </div>
      <WeekRewardsPanel
        data={data}
        highlightUserId={highlightUserId}
        defaultExpanded={false}
      />
    </section>
  );
}
