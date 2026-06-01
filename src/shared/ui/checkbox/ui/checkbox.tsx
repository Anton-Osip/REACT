import {
  type ComponentPropsWithoutRef,
  type FC,
  type ReactNode,
  useEffect,
  useRef,
} from 'react';

import clsx from 'clsx';

import { Typography } from '@/shared/ui';

import { CheckboxContext, useCheckbox } from '../model';

import s from './checkbox.module.css';

type Props = {
  checked: boolean | 'indeterminate';
  onCheckedChange: (checked: boolean) => void;
  id: string;
  children: ReactNode;
  className?: string;
};

export const Checkbox: FC<Props> & {
  Indicator: typeof CheckboxIndicator;
  Label: typeof CheckboxLabel;
} = ({ children, id, checked, onCheckedChange, className }) => {
  return (
    <CheckboxContext.Provider value={{ checked, onCheckedChange, id }}>
      <div className={clsx(s.checkbox, className)}>{children}</div>
    </CheckboxContext.Provider>
  );
};

type IndicatorProps = ComponentPropsWithoutRef<'label'>;

const CheckboxIndicator: FC<IndicatorProps> = ({
  className,
  children,
  ...props
}) => {
  const { checked, onCheckedChange, id } = useCheckbox();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = checked === 'indeterminate';
    }
  }, [checked]);

  return (
    <span className={s.root}>
      <input
        ref={inputRef}
        id={id}
        type="checkbox"
        className={s.input}
        checked={checked === true}
        onChange={(event) => onCheckedChange(event.target.checked)}
      />
      <label htmlFor={id} className={clsx(s.indicator, className)} {...props}>
        {children}
      </label>
    </span>
  );
};

type LabelProps = ComponentPropsWithoutRef<'label'>;

const CheckboxLabel: FC<LabelProps> = ({ className, children, ...props }) => {
  const { id } = useCheckbox();

  return (
    <Typography
      variant={'body2'}
      className={clsx(s.label, className)}
      as={'label'}
      htmlFor={id}
      {...props}
    >
      {children}
    </Typography>
  );
};

Checkbox.Indicator = CheckboxIndicator;
Checkbox.Label = CheckboxLabel;
