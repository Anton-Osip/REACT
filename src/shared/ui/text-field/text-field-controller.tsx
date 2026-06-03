import { type ReactElement } from 'react';

import {
  type FieldValues,
  useController,
  type UseControllerProps,
} from 'react-hook-form';

import { TextField } from '@/shared/ui';
import type { TextFieldProps } from '@/shared/ui/text-field/text-field.tsx';

export type ControlledTextFieldProps<TFieldValues extends FieldValues> =
  UseControllerProps<TFieldValues> &
    Omit<TextFieldProps, 'onChange' | 'onBlur' | 'value' | 'id'>;

export const TextFieldController = <TFieldValues extends FieldValues>(
  props: ControlledTextFieldProps<TFieldValues>
): ReactElement => {
  const {
    name,
    rules,
    shouldUnregister,
    control,
    defaultValue,
    ...textFieldProps
  } = props;
  const {
    field: { onChange, onBlur, value },
  } = useController({ name, rules, shouldUnregister, control, defaultValue });

  return (
    <TextField
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      id={name}
      {...textFieldProps}
    />
  );
};
