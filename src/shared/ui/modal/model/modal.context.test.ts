import { useContext } from 'react';

import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ModalContext } from './modal.context';

describe('ModalContext', () => {
  afterEach(() => {
    cleanup();
  });

  it('is undefined outside Modal', () => {
    const { result } = renderHook(() => useContext(ModalContext));

    expect(result.current).toBeUndefined();
  });

  it('exposes a Provider component', () => {
    expect(ModalContext.Provider).toBeDefined();
  });
});
