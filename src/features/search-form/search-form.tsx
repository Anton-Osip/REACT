import { type ChangeEvent, Component, type FormEvent } from 'react';
import s from './search-form.module.css';
import clsx from 'clsx';
import { Button, SearchIcon, TextField } from '../../components';
import { saveToStorage } from '../../utils';

interface SearchFormProps {
  className?: string;
  submitInput: (value: string) => void;
  defaultValue?: string;
}

interface SearchFormState {
  value: string;
}

export const STORAGE_KEY = 'searchFormValue';

export class SearchForm extends Component<SearchFormProps, SearchFormState> {
  constructor(props: SearchFormProps) {
    super(props);
    const savedValue = this.props.defaultValue ?? '';

    this.state = {
      value: savedValue,
    };
  }

  onSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    const inputText = this.state.value.trim();

    if (this.state.value === '') {
      saveToStorage(STORAGE_KEY, '');
      this.props.submitInput('');
    }
    if (inputText !== '') {
      saveToStorage(STORAGE_KEY, inputText);
      this.props.submitInput(inputText);
    }
  };

  onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState({ value: value });
  };

  render() {
    const { className } = this.props;

    return (
      <form className={clsx(s.form, className)} onSubmit={this.onSubmitHandler}>
        <TextField
          iconStart={<SearchIcon size={20} />}
          placeholder={'Search'}
          value={this.state.value}
          onChange={this.onChangeHandler}
        />
        <Button type={'submit'}>Search</Button>
      </form>
    );
  }
}
