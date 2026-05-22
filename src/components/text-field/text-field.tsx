import { type ComponentPropsWithoutRef, type FC, type ReactNode } from 'react';

import clsx from 'clsx';

import { Typography } from '@/components';

import s from './text-field.module.css';

export type InputProps = {
  type?: 'text' | 'password';
  label?: string;
  buttonIconEnd?: ReactNode;
  buttonIconActionEnd?: () => void;
  iconStart?: ReactNode;
  isError?: boolean;
  errorText?: string;
} & ComponentPropsWithoutRef<'input'>;

export const TextField: FC<InputProps> = ({
  type = 'text',
  label,
  buttonIconEnd,
  buttonIconActionEnd,
  iconStart,
  isError,
  errorText,
  ...props
}) => {
  return (
    <div>
      {label && (
        <Typography className={s.label} variant={'body2'}>
          {label}
        </Typography>
      )}
      <div className={s.inputWrapper}>
        {iconStart && <div className={s.iconStart}>{iconStart}</div>}
        <input
          type={type}
          className={clsx(
            s.input,
            buttonIconEnd && s.withButtonEnd,
            iconStart && s.withIconStart,
            isError && s.inputError
          )}
          {...props}
        />
        {buttonIconEnd && (
          <button className={s.buttonIconEnd} onClick={buttonIconActionEnd}>
            {buttonIconEnd}
          </button>
        )}
      </div>
      {errorText && (
        <Typography className={s.errorText} variant={'caption'}>
          {errorText}
        </Typography>
      )}
    </div>
  );
};
