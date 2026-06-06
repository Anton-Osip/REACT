import { type ComponentPropsWithoutRef, type FC } from 'react';

import { Checkbox, Typography } from '@/shared/ui';

import s from './checkbox-field.module.css';

export type CheckboxFieldProps = {
  checked: boolean | 'indeterminate';
  onCheckedChange: (checked: boolean) => void;
  onBlur?: ComponentPropsWithoutRef<'input'>['onBlur'];
  id?: string;
  className?: string;
  label?: string;
  errorText?: string;
};

export const CheckboxField: FC<CheckboxFieldProps> = ({
  id,
  checked,
  onCheckedChange,
  onBlur,
  className,
  label,
  errorText,
}) => {
  return (
    <div>
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        onBlur={onBlur}
        id={id}
        className={className}
      >
        <Checkbox.Indicator />
        {label && <Checkbox.Label>{label}</Checkbox.Label>}
      </Checkbox>
      {errorText && (
        <Typography className={s.errorText} variant={'caption'}>
          {errorText}
        </Typography>
      )}
    </div>
  );
};
