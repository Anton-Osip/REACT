import {
  useCallback,
  useRef,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type FC,
} from 'react';

import clsx from 'clsx';

import { Button, Typography } from '@/shared/ui';

import s from './file-field.module.css';

export type FileFieldProps = {
  onChange: (files: FileList | null) => void;
  onBlur?: ComponentPropsWithoutRef<'input'>['onBlur'];
  inputRef?: (node: HTMLInputElement | null) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
  errorText?: string;
};

export const FileField: FC<FileFieldProps> = ({
  onChange,
  onBlur,
  inputRef,
  accept = '*/*',
  multiple = false,
  disabled = false,
  label = 'select file',
  className = '',
  errorText,
}) => {
  const localInputRef = useRef<HTMLInputElement>(null);

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      localInputRef.current = node;
      inputRef?.(node);
    },
    [inputRef]
  );

  const handleClick = () => {
    localInputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files);
  };

  return (
    <div>
      <div className={clsx(s.root, className)}>
        <input
          ref={setInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          onBlur={onBlur}
          className={s.input}
        />
        <Button type="button" onClick={handleClick} disabled={disabled}>
          {label}
        </Button>
      </div>
      {errorText && (
        <Typography className={s.errorText} variant={'caption'}>
          {errorText}
        </Typography>
      )}
    </div>
  );
};
