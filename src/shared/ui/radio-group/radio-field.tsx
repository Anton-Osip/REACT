import { type ComponentPropsWithoutRef, type FC } from 'react';

import clsx from 'clsx';

import { Typography } from '@/shared/ui';
import { RadioGroup } from '@/shared/ui/radio-group/ui/radio-group.tsx';

import s from './radio-field.module.css';

export type RadioOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type RadioFieldProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: ComponentPropsWithoutRef<'input'>['onBlur'];
  options: RadioOption[];
  label?: string;
  className?: string;
  errorText?: string;
};

export const RadioField: FC<RadioFieldProps> = ({
  name,
  value,
  onChange,
  onBlur,
  options,
  label,
  className,
  errorText,
}) => {
  return (
    <div>
      {label && (
        <Typography as={'span'} className={s.label} variant={'body2'}>
          {label}
        </Typography>
      )}
      <RadioGroup
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={clsx(s.group, className)}
      >
        {options.map((option) => (
          <RadioGroup.Item
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </RadioGroup.Item>
        ))}
      </RadioGroup>
      {errorText && (
        <Typography className={s.errorText} variant={'caption'}>
          {errorText}
        </Typography>
      )}
    </div>
  );
};
