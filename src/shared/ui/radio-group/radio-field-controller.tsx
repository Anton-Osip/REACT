import type { ReactElement } from 'react';

import {
  type FieldValues,
  useController,
  type UseControllerProps,
} from 'react-hook-form';

import {
  RadioField,
  type RadioFieldProps,
} from '@/shared/ui/radio-group/radio-field.tsx';

export type ControlledRadioFieldProps<TFieldValues extends FieldValues> =
  UseControllerProps<TFieldValues> &
    Omit<RadioFieldProps, 'name' | 'value' | 'onChange' | 'onBlur'>;

export const RadioFieldController = <TFieldValues extends FieldValues>(
  props: ControlledRadioFieldProps<TFieldValues>
): ReactElement => {
  const {
    name,
    rules,
    shouldUnregister,
    control,
    defaultValue,
    ...radioFieldProps
  } = props;
  const {
    field: { onChange, onBlur, value },
  } = useController({ name, rules, shouldUnregister, control, defaultValue });

  return (
    <RadioField
      name={name}
      value={value ?? ''}
      onChange={onChange}
      onBlur={onBlur}
      {...radioFieldProps}
    />
  );
};
