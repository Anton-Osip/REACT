import { useEffect, useState } from 'react';

import { loadFromStorage, saveToStorage } from '@/utils';

export const ThemeMode = {
  dark: 'dark',
  light: 'light',
} as const;

export type Theme = keyof typeof ThemeMode;

type useThemeReturn = { theme: Theme; toggleTheme: () => void };

const isTheme = (value: unknown): value is Theme => value === ThemeMode.light || value === ThemeMode.dark;

const resolveTheme = (): Theme => {
  const savedTheme = loadFromStorage<Theme | undefined>('theme', undefined);

  if (isTheme(savedTheme)) return savedTheme;

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return ThemeMode.dark;
  }

  return ThemeMode.light;
};

export const useTheme = (): useThemeReturn => {
  const [theme, setTheme] = useState<Theme>(ThemeMode.dark);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(resolveTheme());
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove(ThemeMode.light, ThemeMode.dark);

    if (theme === ThemeMode.dark) {
      root.classList.add(ThemeMode.dark);
    } else {
      root.classList.add(ThemeMode.light);
    }

    saveToStorage('theme', theme);
  }, [theme]);

  const toggleTheme = (): void => {
    setTheme(prev => (prev === ThemeMode.dark ? ThemeMode.light : ThemeMode.dark));
  };

  return { theme, toggleTheme };
};
