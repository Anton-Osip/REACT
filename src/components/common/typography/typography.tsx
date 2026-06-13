'use client';

import { type ComponentPropsWithoutRef, type ElementType, type ReactElement, type ReactNode } from 'react';

const TypographyVariant = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  p: 'p',
} as const;

type TypographyVariantType = keyof typeof TypographyVariant;

export type TypographyProps<T extends ElementType = 'p'> = {
  as?: T;
  children: ReactNode;
  variant?: TypographyVariantType;
  className?: string;
} & ComponentPropsWithoutRef<T>;

const baseStyles = 'font-sans tracking-normal text-foreground';

const variantStyles: Record<TypographyVariantType, string> = {
  h1: 'text-[48px] font-bold leading-[1.5]',
  h2: 'text-[32px] font-bold leading-[1.5]',
  h3: 'text-[24px] font-bold leading-[1.5]',
  h4: 'text-[16px] font-normal leading-[1.5]',
  p: 'text-[14px] font-normal leading-[1.5]',
} as const;

export const Typography = <T extends ElementType = 'p'>(props: TypographyProps<T>): ReactElement => {
  const { variant = TypographyVariant.p, className, as: Component = 'p', children, ...rest } = props;

  return (
    <Component className={[baseStyles, variantStyles[variant], className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Component>
  );
};
