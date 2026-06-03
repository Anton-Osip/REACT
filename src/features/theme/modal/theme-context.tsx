import React, { useEffect, useState } from 'react';

import { loadFromStorage, saveToStorage } from '@/shared/utils';

import { ThemeContext, type Theme, ThemeMode } from './theme.context';

const isTheme = (value: unknown): value is Theme =>
  value === ThemeMode.light || value === ThemeMode.dark;

const getInitialTheme = () => {
  const savedTheme = loadFromStorage<Theme | undefined>('theme', undefined);
  if (isTheme(savedTheme)) return savedTheme;

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return ThemeMode.dark;
  }
  return ThemeMode.light;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove(ThemeMode.light, ThemeMode.dark);
    root.classList.add(theme);
    saveToStorage('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === ThemeMode.dark ? ThemeMode.light : ThemeMode.dark
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
