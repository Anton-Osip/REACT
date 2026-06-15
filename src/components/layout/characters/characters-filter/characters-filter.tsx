'use client';

import { type ChangeEvent, type FC, type SubmitEvent, useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';

import { saveToStorage } from '@/utils';
import { Button, TextField } from '@components/common';

export const STORAGE_KEY = 'character-search';

type Props = {
  className?: string;
  defaultValue?: string | null;
};

export const CharactersFilter: FC<Props> = ({ className, defaultValue = '' }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState<string>(defaultValue ?? '');

  useEffect(() => {
    setValue(defaultValue ?? '');
  }, [defaultValue]);

  const changeSearchValue = (searchValue: string): void => {
    saveToStorage(STORAGE_KEY, searchValue);

    const params = new URLSearchParams(searchParams.toString());

    if (searchValue) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }

    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const onSubmitHandler = (e: SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const inputText = value.trim();

    if (inputText === '' && value !== '') {
      return;
    }

    changeSearchValue(inputText);
    setValue(inputText);
  };

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return (
    <form
      className={clsx('grid w-full grid-cols-[1fr_103px] items-center gap-4', className)}
      onSubmit={onSubmitHandler}
    >
      <TextField placeholder="Search" value={value} onChange={onChangeHandler} />
      <Button type="submit">Search</Button>
    </form>
  );
};
