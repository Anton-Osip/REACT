'use client';

import type { FC } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import { usePathname, useRouter, type Locale, locales } from '@/i18n';
import { Button } from '@components/common';

export const LocaleSwitcher: FC = () => {
  const t = useTranslations('Header');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (nextLocale: Locale): void => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="flex gap-1" role="group" aria-label={t('language')}>
      {locales.map(nextLocale => (
        <Button
          key={nextLocale}
          variant={locale === nextLocale ? 'primary' : 'ghost'}
          onClick={() => switchLocale(nextLocale)}
          className="min-w-10 px-3 uppercase"
        >
          {nextLocale}
        </Button>
      ))}
    </div>
  );
};
