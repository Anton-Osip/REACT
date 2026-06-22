'use client';

import type { FC } from 'react';

import { clsx } from 'clsx';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/constants';
import { ThemeMode, useErrorButton, useTheme } from '@/hooks';
import { Link, useRouter } from '@/i18n';
import { withBasePath } from '@/utils';
import { Button, MoonIcon, SunIcon } from '@components/common';
import { Container, LocaleSwitcher } from '@components/layout';

type Props = { className?: string };

export const Header: FC<Props> = ({ className }) => {
  const t = useTranslations('Header');
  const router = useRouter();

  const { toggleTheme, theme } = useTheme();
  const { simulateError } = useErrorButton();

  return (
    <header className={clsx('w-full py-8', className)}>
      <Container className="flex items-center justify-between">
        <Link href={ROUTES.CHARACTERS}>
          <Image src={withBasePath('/logo.svg')} alt="Rick and Morty" width={220} height={64} priority />
        </Link>
        <nav className="flex gap-2">
          <Button onClick={() => router.replace(ROUTES.CHARACTERS)} variant="ghost" fullWidth>
            {t('navigate.homePage')}
          </Button>
          <Button onClick={() => router.replace(ROUTES.ABOUT)} variant="ghost" fullWidth>
            {t('navigate.aboutPage')}
          </Button>
        </nav>
        <div className="flex gap-2">
          <LocaleSwitcher />
          <Button variant="primary" className="p-2" onClick={simulateError}>
            {t('navigate.simulateError')}
          </Button>
          <Button
            variant="primary"
            onClick={toggleTheme}
            aria-label={t('switchTheme')}
            className="p-2"
            icon={theme === ThemeMode.light ? <MoonIcon /> : <SunIcon />}
          />
        </div>
      </Container>
    </header>
  );
};
