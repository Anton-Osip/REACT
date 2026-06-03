import { useContext } from 'react';

import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  CHECKBOX_INDETERMINATE,
  CheckboxContext,
  isCheckboxIndeterminate,
} from './checkbox.context.ts';

describe('CheckboxContext', () => {
  afterEach(() => {
    cleanup();
  });

  it('is undefined outside CheckboxField', () => {
    const { result } = renderHook(() => useContext(CheckboxContext));

    expect(result.current).toBeUndefined();
  });

  it('exposes a Provider component', () => {
    expect(CheckboxContext.Provider).toBeDefined();
  });
});

describe('isCheckboxIndeterminate', () => {
  it('returns true for indeterminate state', () => {
    expect(isCheckboxIndeterminate(CHECKBOX_INDETERMINATE)).toBe(true);
  });

  it('returns false for boolean states', () => {
    expect(isCheckboxIndeterminate(true)).toBe(false);
    expect(isCheckboxIndeterminate(false)).toBe(false);
  });
});
