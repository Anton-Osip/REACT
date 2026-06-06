import React from 'react';

import {
  ThemeMode,
  useThemeState,
} from '@/features/theme/modal/use-theme-state.ts';
import { Button, MoonIcon, SunIcon } from '@/shared/ui';

import s from './theme-toggle.module.css';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeState();

  return (
    <Button
      onClick={toggleTheme}
      aria-label="Switch theme"
      className={s.themeToggle}
    >
      {theme === ThemeMode.light && <MoonIcon size={20} />}
      {theme === ThemeMode.dark && <SunIcon size={20} />}
    </Button>
  );
};
