import { type ReactNode } from 'react';

import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RadioGroup } from '../ui/radio-group.tsx';

import { useRadioGroup } from './radio-group.context.ts';

describe('useRadioGroup', () => {
  afterEach(() => {
    cleanup();
  });

  it('throws when used outside RadioGroup', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useRadioGroup())).toThrow(
      'Radio компонент должен использоваться внутри RadioGroup'
    );

    consoleSpy.mockRestore();
  });

  it('returns name, selectedValue and onChange inside RadioGroup', () => {
    const onChange = vi.fn();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <RadioGroup name="plan" defaultValue="basic" onChange={onChange}>
        {children}
      </RadioGroup>
    );

    const { result } = renderHook(() => useRadioGroup(), { wrapper });

    expect(result.current.name).toBe('plan');
    expect(result.current.selectedValue).toBe('basic');
    expect(typeof result.current.onChange).toBe('function');
  });

  it('onChange from context can be invoked', () => {
    const onChange = vi.fn();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <RadioGroup name="plan" defaultValue="basic" onChange={onChange}>
        {children}
      </RadioGroup>
    );

    const { result } = renderHook(() => useRadioGroup(), { wrapper });

    act(() => {
      result.current.onChange('pro');
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('pro');
    expect(result.current.selectedValue).toBe('pro');
  });
});
