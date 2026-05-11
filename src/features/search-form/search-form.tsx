import { type ChangeEvent, type FC, type FormEvent, useState } from 'react';
import s from './search-form.module.css';
import clsx from 'clsx';
import { Button, SearchIcon, TextField } from '../../components';
import { saveToStorage } from '../../utils';

interface SearchFormProps {
  className?: string;
  submitInput: (value: string) => void;
  defaultValue?: string;
}

export const STORAGE_KEY = 'searchFormValue';

export const SearchForm: FC<SearchFormProps> = ({
  className,
  submitInput,
  defaultValue = '',
}) => {
  const [value, setValue] = useState<string>(defaultValue);

  const onSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    const inputText = value.trim();

    if (value === '') {
      saveToStorage(STORAGE_KEY, '');
      submitInput('');
    }
    if (inputText !== '') {
      saveToStorage(STORAGE_KEY, inputText);
      submitInput(inputText);
    }
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

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
