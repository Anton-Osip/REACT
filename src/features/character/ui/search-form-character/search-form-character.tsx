import {
  type ChangeEvent,
  type FC,
  type FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';

import { STORAGE_KEY } from '@/pages/character/route.tsx';
import { Button, SearchIcon, TextField } from '@/shared/ui';
import { saveToStorage } from '@/shared/utils';

import s from './search-form-character.module.css';

type Props = {
  className?: string;
  defaultValue?: string | null;
};

export const SearchFormCharacter: FC<Props> = ({
  className,
  defaultValue = '',
}) => {
  const navigate = useNavigate({ from: '/character' });
  const [value, setValue] = useState<string>(defaultValue ?? '');

  useEffect(() => {
    setValue(defaultValue ?? '');
  }, [defaultValue]);

  const searchCharactersByName = (value: string): void => {
    saveToStorage(STORAGE_KEY, value);
    void navigate({
      search: (prev) => ({ ...prev, page: 1, search: value }),
    });
  };

  const onSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim() === '' && value !== '') {
      return;
    }
    const inputText = value.trim();
    searchCharactersByName(inputText);
    setValue(inputText);
  };

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  }, []);

  return (
    <form className={clsx(s.form, className)} onSubmit={onSubmitHandler}>
      <TextField
        iconStart={<SearchIcon size={20} />}
        placeholder={'Search'}
        value={value}
        onChange={onChangeHandler}
      />
      <Button type={'submit'}>Search</Button>
    </form>
  );
};
