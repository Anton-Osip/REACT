import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from 'react';

import clsx from 'clsx';

import s from './typography.module.css';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body1'
  | 'body2'
  | 'subtitle1'
  | 'subtitle2'
  | 'caption'
  | 'overline'
  | 'link1'
  | 'link2';

export type TypographyProps<T extends ElementType = 'p'> = {
  as?: T;
  children: ReactNode;
  variant?: TypographyVariant;
  className?: string;
} & ComponentPropsWithoutRef<T>;

export function Typography<T extends ElementType = 'p'>(
  props: TypographyProps<T>
) {
  const {
    variant = 'body1',
    className,
    as: Component = 'p',
    children,
    ...rest
  } = props;

  const Element: ElementType = Component;

  return (
    <Element className={clsx(s.typography, s[variant], className)} {...rest}>
      {children}
    </Element>
  );
}
