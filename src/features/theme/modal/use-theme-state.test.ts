import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeMode, useThemeState } from './use-theme-state.ts';

function mockPrefersColorScheme(matches: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)' ? matches : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('useThemeState', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
    vi.restoreAllMocks();
  });

  it('initializes theme from localStorage', () => {
    localStorage.setItem('theme', JSON.stringify('dark'));

    const { result } = renderHook(() => useThemeState());

    expect(result.current.theme).toBe(ThemeMode.dark);
  });

  it('defaults to light when storage is empty and system prefers light', () => {
    mockPrefersColorScheme(false);

    const { result } = renderHook(() => useThemeState());

    expect(result.current.theme).toBe(ThemeMode.light);
  });

  it('defaults to dark when storage is empty and system prefers dark', () => {
    mockPrefersColorScheme(true);

    const { result } = renderHook(() => useThemeState());

    expect(result.current.theme).toBe(ThemeMode.dark);
  });

  it('ignores invalid saved theme and falls back to system preference', () => {
    localStorage.setItem('theme', JSON.stringify('neon'));
    mockPrefersColorScheme(true);

    const { result } = renderHook(() => useThemeState());

    expect(result.current.theme).toBe(ThemeMode.dark);
  });

  it('applies theme class to document root', async () => {
    localStorage.setItem('theme', JSON.stringify('light'));

    renderHook(() => useThemeState());

    await waitFor(() => {
      expect(document.documentElement).toHaveClass('light');
      expect(document.documentElement).not.toHaveClass('dark');
    });
  });

  it('persists theme to localStorage when theme changes', async () => {
    localStorage.setItem('theme', JSON.stringify('light'));

    const { result } = renderHook(() => useThemeState());

    act(() => {
      result.current.toggleTheme();
    });

    await waitFor(() => {
      expect(localStorage.getItem('theme')).toBe(JSON.stringify('dark'));
    });
  });

  it('toggleTheme switches between light and dark', () => {
    localStorage.setItem('theme', JSON.stringify('light'));

    const { result } = renderHook(() => useThemeState());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe(ThemeMode.dark);

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe(ThemeMode.light);
  });

  it('updates document root class when theme is toggled', async () => {
    localStorage.setItem('theme', JSON.stringify('light'));

    const { result } = renderHook(() => useThemeState());

    act(() => {
      result.current.toggleTheme();
    });

    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark');
      expect(document.documentElement).not.toHaveClass('light');
    });
  });
});
