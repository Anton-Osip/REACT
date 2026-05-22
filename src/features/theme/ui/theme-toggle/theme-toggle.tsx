import React from 'react';
import { useTheme } from '../../modal';
import { Button } from '../../../../components';
import { MoonIcon, SunIcon } from '../../../../components';
import s from './theme-toggle.module.css';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      aria-label="Switch theme"
      className={s.themeToggle}
    >
      {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
    </Button>
  );
};
