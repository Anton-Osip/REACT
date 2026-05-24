import { type ReactNode } from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from './theme-context.tsx';
import { useTheme } from './use-theme.tsx';

function ThemeConsumer() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button type="button" onClick={toggleTheme}>
        Toggle
      </button>
    </div>
  );
}

function renderThemeProvider(ui: ReactNode = <ThemeConsumer />) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('ThemeProvider', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
  });

  it('initializes theme from localStorage when value is valid', () => {
    localStorage.setItem('theme', JSON.stringify('dark'));

    renderThemeProvider();

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveClass('dark');
  });

  it('falls back to dark when storage is invalid and OS prefers dark', () => {
    localStorage.setItem('theme', JSON.stringify('invalid-theme'));
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    renderThemeProvider();

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveClass('dark');
  });

  it('falls back to light when storage is missing and OS prefers light', () => {
    renderThemeProvider();

    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(document.documentElement).toHaveClass('light');
  });

  it('persists theme to localStorage on mount and after toggle', async () => {
    localStorage.setItem('theme', JSON.stringify('light'));

    renderThemeProvider();

    expect(JSON.parse(localStorage.getItem('theme') ?? '""')).toBe('light');

    await user.click(screen.getByRole('button', { name: 'Toggle' }));

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(JSON.parse(localStorage.getItem('theme') ?? '""')).toBe('dark');
    expect(document.documentElement).toHaveClass('dark');
    expect(document.documentElement).not.toHaveClass('light');
  });

  it('toggleTheme switches between light and dark', async () => {
    localStorage.setItem('theme', JSON.stringify('light'));

    renderThemeProvider();

    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');

    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(document.documentElement).toHaveClass('light');
  });
});
