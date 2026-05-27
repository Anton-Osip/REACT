import { createContext } from 'react';

export const ThemeMode = {
  dark: 'dark',
  light: 'light',
} as const;

export type Theme = keyof typeof ThemeMode;

export type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
