import {
  type ComponentPropsWithoutRef,
  type FC,
  type ReactNode,
  useId,
} from 'react';

import clsx from 'clsx';

import { Typography } from '@/shared/ui';

import s from './text-field.module.css';

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
  ...props
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div>
      {label && (
        <Typography
          as={'label'}
          htmlFor={inputId}
          className={s.label}
          variant={'body2'}
        >
          {label}
        </Typography>
      )}
      <div className={s.inputWrapper}>
        {iconStart && <div className={s.iconStart}>{iconStart}</div>}
        <input
          id={inputId}
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
