import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useRef,
} from 'react';

import clsx from 'clsx';

import { useModalFocus } from '../model';

import s from './modal.module.css';

type ContainerProps = {
  className?: string;
  children: ReactNode;
  labelledBy?: string;
  describedBy?: string;
} & Omit<ComponentPropsWithoutRef<'div'>, 'role'>;

export const ModalContainer = forwardRef<HTMLDivElement, ContainerProps>(
  (
    { className, children, labelledBy, describedBy, onClick, ...props },
    forwardedRef
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    useModalFocus(containerRef);

    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;

        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef]
    );

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onClick?.(event);
    };

    return (
      <div
        ref={setRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={clsx(s.container, className)}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalContainer.displayName = 'ModalContainer';
