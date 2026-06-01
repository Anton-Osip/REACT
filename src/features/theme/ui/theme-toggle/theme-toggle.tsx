import React from 'react';

import { ThemeMode } from '@/features/theme/modal/theme.context.ts';
import { Button, MoonIcon, SunIcon } from '@/shared/ui';

import { useTheme } from '../../modal';

import s from './theme-toggle.module.css';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      aria-label="Switch theme"
      className={s.themeToggle}
    >
      {theme === ThemeMode.light ? (
        <MoonIcon size={20} />
      ) : (
        <SunIcon size={20} />
      )}
    </Button>
  );
};
