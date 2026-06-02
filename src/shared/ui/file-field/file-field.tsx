import { useRef, type ChangeEvent, type FC } from 'react';

import clsx from 'clsx';

import { Button } from '@/shared/ui/button';

import s from './file-field.module.css';

type Props = {
  onChange: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
};

export const FileField: FC<Props> = ({
  onChange,
  accept = '*/*',
  multiple = false,
  disabled = false,
  label = 'select file',
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files);
  };

  return (
    <div className={clsx(s.root, className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
        className={s.input}
      />
      <Button type="button" onClick={handleClick} disabled={disabled}>
        {label}
      </Button>
    </div>
  );
};
