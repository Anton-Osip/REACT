import clsx from 'clsx';
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from 'react';
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

type TypographyElementType =
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'span'
  | 'div'
  | 'label';

export type TypographyProps<T extends ElementType = TypographyElementType> = {
  as?: T;
  children: ReactNode;
  variant?: TypographyVariant;
  className?: string;
} & ComponentPropsWithoutRef<T>;

export function Typography<T extends ElementType = TypographyElementType>(
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
