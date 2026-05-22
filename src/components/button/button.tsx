import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from 'react';

import clsx from 'clsx';

import s from './button.module.css';

export type ButtonProps<T extends ElementType = 'button' | 'a'> = {
  as?: T;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  className?: string;
  icon?: ReactNode;
} & ComponentPropsWithoutRef<T>;

export function Button<T extends ElementType = 'button' | 'a'>(
  props: ButtonProps<T>
) {
  const {
    variant = 'primary',
    fullWidth,
    className,
    as: Component = 'button',
    icon,
    children,
    ...rest
  } = props;

  const Element = Component as ElementType;

  return (
    <Element
      className={clsx(
        s.button,
        s[variant],
        icon && s.withIcon,
        fullWidth && s.fullWidth,
        className
      )}
      {...rest}
    >
      {icon && icon}
      {children}
    </Element>
  );
}
