'use client';

import { FC } from 'react';

import { clsx } from 'clsx';
import { Image } from 'next/dist/client/image-component';
import Link from 'next/link';

import { ThemeMode, useErrorButton, useTheme } from '@/hooks';
import { Button, MoonIcon, SunIcon } from '@components/common';
import { Container } from '@components/layout';

type Props = { className?: string };

export const Header: FC<Props> = ({ className }) => {
  const { toggleTheme, theme } = useTheme();
  const { simulateError } = useErrorButton();

  return (
    <header className={clsx('w-full pt-16 pb-8', className)}>
      <Container className="flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.svg" alt="Rick and Morty" width={220} height={64} />
        </Link>
        <nav className="flex gap-2">
          <Button href="/" variant="ghost" fullWidth>
            Home
          </Button>
          <Button href="/about" variant="ghost" fullWidth>
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
