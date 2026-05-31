import { type ReactNode } from 'react';

import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Modal } from '../ui/modal.tsx';

import { useModal } from './use-modal.tsx';

describe('useModal', () => {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
  });

  it('throws when used outside Modal', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useModal())).toThrow(
      'Modal.* компонент должен использоваться внутри <Modal>'
    );

    consoleSpy.mockRestore();
  });

  it('returns isOpen and onClose inside Modal', () => {
    const onClose = vi.fn();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Modal isOpen onClose={onClose}>
        {children}
      </Modal>
    );

    const { result } = renderHook(() => useModal(), { wrapper });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.onClose).toBe(onClose);
  });

  it('onClose from context can be invoked', () => {
    const onClose = vi.fn();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Modal isOpen onClose={onClose}>
        {children}
      </Modal>
    );

    const { result } = renderHook(() => useModal(), { wrapper });

    act(() => {
      result.current.onClose();
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
