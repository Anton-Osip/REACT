import type { ReactElement } from 'react';

import {
  type FieldValues,
  useController,
  type UseControllerProps,
} from 'react-hook-form';

import {
  FileField,
  type FileFieldProps,
} from '@/shared/ui/file-field/file-field.tsx';

export type ControlledFileFieldProps<TFieldValues extends FieldValues> =
  UseControllerProps<TFieldValues> &
    Omit<FileFieldProps, 'onChange' | 'onBlur' | 'inputRef'>;

export const FileFieldController = <TFieldValues extends FieldValues>(
  props: ControlledFileFieldProps<TFieldValues>
): ReactElement => {
  const {
    name,
    rules,
    shouldUnregister,
    control,
    defaultValue,
    ...fileFieldProps
  } = props;
  const {
    field: { onChange, onBlur, ref },
  } = useController({ name, rules, shouldUnregister, control, defaultValue });

  return (
    <FileField
      onChange={onChange}
      onBlur={onBlur}
      inputRef={ref}
      {...fileFieldProps}
    />
  );
};
