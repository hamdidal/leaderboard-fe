import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function LangSwitcher() {
  const { i18n, t } = useTranslation();

  const toggle = () => {
    const next = i18n.language === 'en' ? 'tr' : 'en';
    void i18n.changeLanguage(next);
    localStorage.setItem('panteon-locale', next);
  };

  const nextLang = i18n.language === 'en' ? 'tr' : 'en';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('lang.switchTo', { lang: t(`lang.${nextLang}`) })}
      className={cn('design-icon-btn min-w-[2.75rem] text-[0.72rem] font-bold uppercase tracking-wide')}
    >
      {i18n.language === 'en' ? 'TR' : 'EN'}
    </button>
  );
}
