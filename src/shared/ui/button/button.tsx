import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from 'react';

import clsx from 'clsx';

import s from './button.module.css';

export type Props<T extends ElementType = 'button'> = {
  as?: T;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  className?: string;
  icon?: ReactNode;
} & ComponentPropsWithoutRef<T>;

export const Button = <T extends ElementType = 'button'>(props: Props<T>) => {
  const {
    variant = 'primary',
    fullWidth,
    className,
    as: Component = 'button',
    icon,
    children,
    ...rest
  } = props;

  return (
    <Component
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
    </Component>
  );
};
