import { useEffect, useState } from 'react';

import { loadFromStorage, saveToStorage } from '@/shared/utils';

export const ThemeMode = {
  dark: 'dark',
  light: 'light',
} as const;

export type Theme = keyof typeof ThemeMode;

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

export const useThemeState = () => {
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

  return { theme, toggleTheme };
};
