'use client';

import { type ComponentPropsWithoutRef, type FC, type ReactNode, useId } from 'react';

import clsx from 'clsx';

import { Typography } from '@components/common';

export type TextFieldProps = {
  type?: 'text' | 'password' | 'email' | 'number';
  label?: string;
  buttonIconEnd?: ReactNode;
  buttonIconActionEnd?: () => void;
  iconStart?: ReactNode;
  isError?: boolean;
  errorText?: string;
  id?: string;
} & ComponentPropsWithoutRef<'input'>;

export const TextField: FC<TextFieldProps> = ({
  type = 'text',
  label,
  buttonIconEnd,
  buttonIconActionEnd,
  iconStart,
  isError,
  errorText,
  id,
  className,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div>
      {label && (
        <Typography as="label" htmlFor={inputId} variant="p" className="text-foreground">
          {label}
        </Typography>
      )}
      <div className="group relative w-full">
        {iconStart && (
          <div
            className={clsx(
              'absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-input-icon',
              'transition-colors duration-300 ease-in-out',
              'group-hover:text-input-hover-text group-focus-within:text-input-hover-text',
            )}
          >
            {iconStart}
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={clsx(
            'w-full rounded-sm border border-input-border bg-input px-3 py-1.5',
            'text-sm font-normal leading-normal text-foreground',
            'transition-[color,border-color,background-color] duration-300 ease-in-out',
            'placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out',
            'hover:border-input-hover-border hover:bg-input-hover hover:text-input-hover-text',
            'focus:border-transparent focus:outline-2 focus:outline-brand-500 focus:outline-offset-0',
            'focus:placeholder:opacity-0',
            buttonIconEnd && 'pr-[41px]',
            iconStart && 'pl-[41px]',
            isError && 'border-highlight-500 text-highlight-500',
            className,
          )}
          {...props}
        />
        {buttonIconEnd && (
          <button
            type="button"
            className={clsx(
              'absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2',
              'cursor-pointer border-0 bg-transparent text-input-icon outline-none',
            )}
            onClick={buttonIconActionEnd}
          >
            {buttonIconEnd}
          </button>
        )}
      </div>
      {errorText && (
        <Typography variant="h4" className="mt-[5px] text-highlight-500">
          {errorText}
        </Typography>
      )}
    </div>
  );
};
