'use client';

import { type ComponentPropsWithoutRef, type ElementType, FC, type ReactNode } from 'react';

const ButtonVariant = {
  primary: 'primary',
  ghost: 'ghost',
} as const;

type ButtonVariantType = keyof typeof ButtonVariant;

export type Props<T extends ElementType = 'button'> = {
  as?: T;
  children: ReactNode;
  variant?: ButtonVariantType;
  fullWidth?: boolean;
  className?: string;
  icon?: ReactNode;
} & ComponentPropsWithoutRef<T>;

const baseStyles = [
  'block cursor-pointer box-border border-0 px-7 py-1.5 rounded',
  'font-bold text-sm leading-6 tracking-normal no-underline ',
  'transition-[transform,background-color,color] duration-300 ease-in-out',
  'enabled:active:scale-95 disabled:cursor-default disabled:text-surface-600',
  'enabled:focus-visible:outline-2 enabled:focus-visible:outline-highlight-500',
].join(' ');

const variantStyles: Record<ButtonVariantType, string> = {
  primary: [
    'bg-brand-500 shadow-[0_4px_18px_0_#11b0c859] text-surface-100',
    'enabled:hover:bg-brand-300 enabled:active:opacity-80',
    'disabled:opacity-50',
  ].join(' '),
  ghost: ['bg-transparent text-foreground enabled:opacity-50', 'disabled:opacity-50'].join(' '),
} as const;

export const Button: FC<Props> = <T extends ElementType = 'button'>(props: Props<T>) => {
  const {
    variant = ButtonVariant.primary,
    fullWidth,
    className,
    as: Component = 'button',
    icon,
    children,
    ...rest
  } = props;

  return (
    <Component
      className={[
        baseStyles,
        variantStyles[variant],
        icon && 'flex items-center justify-center gap-2.5',
        fullWidth && 'w-full',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {icon && icon}
      {children}
    </Component>
  );
};
