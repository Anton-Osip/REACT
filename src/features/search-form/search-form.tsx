import { type ChangeEvent, Component, type FormEvent } from 'react';
import s from './search-form.module.css';
import clsx from 'clsx';
import { Button, SearchIcon, TextField } from '../../components';

interface SearchFormProps {
  className?: string;
  submitInput: (value: string) => void;
}

interface SearchFormState {
  value: string;
}

export class SearchForm extends Component<SearchFormProps, SearchFormState> {
  constructor(props: SearchFormProps) {
    super(props);
    this.state = {
      value: '',
    };
  }

  onSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    const inputText = this.state.value.trim();

    if (this.state.value === '') {
      this.props.submitInput('');
    }
    if (inputText !== '') {
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
