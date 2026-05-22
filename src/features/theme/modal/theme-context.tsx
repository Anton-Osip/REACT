import React, { useEffect, useState } from 'react';

import { loadFromStorage, saveToStorage } from '@/utils';

import { ThemeContext, type Theme } from './theme.context';

const isTheme = (value: unknown): value is Theme =>
  value === 'light' || value === 'dark';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = loadFromStorage<Theme | undefined>('theme', undefined);
    if (isTheme(savedTheme)) return savedTheme;

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    saveToStorage('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
