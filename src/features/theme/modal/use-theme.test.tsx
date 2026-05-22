import { type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';
import { ThemeProvider } from './theme-context.tsx';
import { useTheme } from './use-theme.tsx';

describe('useTheme', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('theme', JSON.stringify('light'));
  });

  it('throws when used outside ThemeProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within ThemeProvider'
    );

    consoleSpy.mockRestore();
  });

  it('returns theme and toggleTheme inside ThemeProvider', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');
    expect(typeof result.current.toggleTheme).toBe('function');
  });

  it('toggleTheme updates theme via context', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
  });
});
