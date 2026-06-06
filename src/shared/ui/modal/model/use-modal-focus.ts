import { type RefObject, useEffect, useRef } from 'react';

import { getFocusableElements } from '../lib/get-focusable-elements.ts';

import { useModal } from './use-modal.tsx';

export const useModalFocus = (containerRef: RefObject<HTMLElement | null>) => {
  const { isOpen, returnFocusRef } = useModal();
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const returnFocusTarget = returnFocusRef?.current ?? null;

    previousFocusRef.current =
      returnFocusTarget ??
      (document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null);

    const container = containerRef.current;
    const focusable = getFocusableElements(container);

    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      container.focus();
    }

    return () => {
      (returnFocusTarget ?? previousFocusRef.current)?.focus();
    };
  }, [isOpen, returnFocusRef, containerRef]);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, containerRef]);
};
