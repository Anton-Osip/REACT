import {
  type ComponentPropsWithoutRef,
  type FC,
  type ReactNode,
  useEffect,
  useId,
  useRef,
} from 'react';

import clsx from 'clsx';

import { Typography } from '@/shared/ui';
import { CheckIconSvg } from '@/shared/ui/icons/components/check-icon';

import { CheckboxContext, useCheckbox } from '../model';

import s from './checkbox.module.css';

type Props = {
  checked: boolean | 'indeterminate';
  onCheckedChange: (checked: boolean) => void;
  onBlur?: ComponentPropsWithoutRef<'input'>['onBlur'];
  id?: string;
  children: ReactNode;
  className?: string;
};

export const Checkbox: FC<Props> & {
  Indicator: typeof CheckboxIndicator;
  Label: typeof CheckboxLabel;
} = ({ children, id, checked, onCheckedChange, onBlur, className }) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <CheckboxContext.Provider
      value={{ checked, onCheckedChange, onBlur, id: inputId }}
    >
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
  const { checked, onCheckedChange, onBlur, id } = useCheckbox();
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
        onBlur={onBlur}
      />
      <label htmlFor={id} className={clsx(s.indicator, className)} {...props}>
        <CheckIconSvg aria-hidden="true" className={s.checkIcon} />
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
