import { type ReactElement } from 'react';

import {
  type FieldValues,
  useController,
  type UseControllerProps,
} from 'react-hook-form';

import { PasswordField } from '@/shared/ui/password-field/password-field.tsx';
import type { PasswordFieldProps } from '@/shared/ui/password-field/password-field.tsx';

export type PasswordFieldControllerProps<TFieldValues extends FieldValues> =
  UseControllerProps<TFieldValues> &
    Omit<PasswordFieldProps, 'onChange' | 'onBlur' | 'value' | 'id'>;

export const PasswordFieldController = <TFieldValues extends FieldValues>(
  props: PasswordFieldControllerProps<TFieldValues>
): ReactElement => {
  const {
    name,
    rules,
    shouldUnregister,
    control,
    defaultValue,
    ...passwordFieldProps
  } = props;
  const {
    field: { onChange, onBlur, value },
  } = useController({ name, rules, shouldUnregister, control, defaultValue });

  return (
    <PasswordField
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      id={name}
      {...passwordFieldProps}
    />
  );
};
