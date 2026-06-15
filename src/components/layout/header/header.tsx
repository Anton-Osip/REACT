'use client';

import type { FC } from 'react';

import { clsx } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/constants';
import { ThemeMode, useErrorButton, useTheme } from '@/hooks';
import { withBasePath } from '@/utils';
import { Button, MoonIcon, SunIcon } from '@components/common';
import { Container } from '@components/layout';

type Props = { className?: string };

export const Header: FC<Props> = ({ className }) => {
  const { toggleTheme, theme } = useTheme();
  const { simulateError } = useErrorButton();
  const router = useRouter();

  return (
    <header className={clsx('w-full  py-8', className)}>
      <Container className="flex items-center justify-between">
        <Link href={ROUTES.HOME}>
          <Image src={withBasePath('/logo.svg')} alt="Rick and Morty" width={220} height={64} priority />
        </Link>
        <nav className="flex gap-2">
          <Button onClick={() => router.replace(ROUTES.HOME)} variant="ghost" fullWidth>
            Home
          </Button>
          <Button
            onClick={() => {
              router.replace(ROUTES.ABOUT);
            }}
            variant="ghost"
            fullWidth
          >
            About
          </Button>
        </nav>
        <div className="flex gap-2">
          <Button variant="primary" className="p-2" onClick={simulateError}>
            simulate error
          </Button>
          <Button
            variant="primary"
            onClick={toggleTheme}
            aria-label="Switch theme"
            className="p-2"
            icon={theme === ThemeMode.light ? <MoonIcon /> : <SunIcon />}
          />
        </div>
      </Container>
    </header>
  );
};
