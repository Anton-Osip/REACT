import { useContext } from 'react';

import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ThemeContext } from './theme.context';

describe('ThemeContext', () => {
  afterEach(() => {
    cleanup();
  });

  it('is undefined outside ThemeProvider', () => {
    const { result } = renderHook(() => useContext(ThemeContext));

    expect(result.current).toBeUndefined();
  });

  it('exposes a Provider component', () => {
    expect(ThemeContext.Provider).toBeDefined();
  });
});
