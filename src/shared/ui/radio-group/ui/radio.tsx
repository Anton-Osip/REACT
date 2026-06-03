import React from 'react';

import clsx from 'clsx';

import { Typography } from '@/shared/ui';
import { useRadioGroup } from '@/shared/ui/radio-group/model';

import s from './radio-group.module.css';

type Props = {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export const RadioItem: React.FC<Props> = ({
  value,
  disabled = false,
  children,
  className = '',
}) => {
  const { name, selectedValue, onChange, onBlur } = useRadioGroup();
  const checked = selectedValue === value;

  return (
    <label className={clsx(s.item, disabled && s.itemDisabled, className)}>
      <span className={s.root}>
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          onBlur={onBlur}
          disabled={disabled}
          className={s.input}
        />
        <span className={s.indicator} aria-hidden="true" />
      </span>
      {children && (
        <Typography as={'span'} variant={'body2'} className={s.label}>
          {children}
        </Typography>
      )}
    </label>
  );
};
