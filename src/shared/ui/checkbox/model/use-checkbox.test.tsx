import { type ReactNode } from 'react';

import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Checkbox } from '../ui/checkbox.tsx';

import { useCheckbox } from './use-checkbox.tsx';

describe('useCheckbox', () => {
  afterEach(() => {
    cleanup();
  });

  it('throws when used outside CheckboxField', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useCheckbox())).toThrow(
      'CheckboxField.* компонент должен использоваться внутри <CheckboxField>'
    );

    consoleSpy.mockRestore();
  });

  it('returns checked, onCheckedChange and id inside CheckboxField', () => {
    const onCheckedChange = vi.fn();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Checkbox id="terms" checked={true} onCheckedChange={onCheckedChange}>
        {children}
      </Checkbox>
    );

    const { result } = renderHook(() => useCheckbox(), { wrapper });

    expect(result.current.checked).toBe(true);
    expect(result.current.onCheckedChange).toBe(onCheckedChange);
    expect(result.current.id).toBe('terms');
  });

  it('onCheckedChange from context can be invoked', () => {
    const onCheckedChange = vi.fn();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Checkbox id="terms" checked={false} onCheckedChange={onCheckedChange}>
        {children}
      </Checkbox>
    );

    const { result } = renderHook(() => useCheckbox(), { wrapper });

    act(() => {
      result.current.onCheckedChange(true);
    });

    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
