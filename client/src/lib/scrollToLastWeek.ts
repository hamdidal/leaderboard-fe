export const LAST_WEEK_SECTION_ID = 'last-week-section';

export function scrollToLastWeekSection(): void {
  document.getElementById(LAST_WEEK_SECTION_ID)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}
