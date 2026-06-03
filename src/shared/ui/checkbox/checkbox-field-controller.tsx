import type { ReactElement } from 'react';

import {
  type FieldValues,
  useController,
  type UseControllerProps,
} from 'react-hook-form';

import {
  CheckboxField,
  type CheckboxFieldProps,
} from '@/shared/ui/checkbox/checkbox-field.tsx';

export type ControlledCheckboxFieldProps<TFieldValues extends FieldValues> =
  UseControllerProps<TFieldValues> &
    Omit<CheckboxFieldProps, 'checked' | 'onCheckedChange' | 'onBlur' | 'id'>;

export const CheckboxFieldController = <TFieldValues extends FieldValues>(
  props: ControlledCheckboxFieldProps<TFieldValues>
): ReactElement => {
  const {
    name,
    rules,
    shouldUnregister,
    control,
    defaultValue,
    ...checkboxFieldProps
  } = props;
  const {
    field: { onChange, onBlur, value },
  } = useController({ name, rules, shouldUnregister, control, defaultValue });

  return (
    <CheckboxField
      checked={value ?? false}
      onCheckedChange={onChange}
      onBlur={onBlur}
      id={name}
      {...checkboxFieldProps}
    />
  );
};
