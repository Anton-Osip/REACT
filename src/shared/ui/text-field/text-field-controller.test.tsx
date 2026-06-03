import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { afterEach, describe, expect, it } from 'vitest';

import { TextFieldController } from './text-field-controller.tsx';

type FormValues = {
  username: string;
};

const TestForm = () => {
  const { control } = useForm<FormValues>({
    defaultValues: { username: '' },
  });

  return (
    <TextFieldController name="username" control={control} label="Username" />
  );
};

describe('TextFieldController', () => {
  afterEach(() => {
    cleanup();
  });

  it('connects text input to react-hook-form field', () => {
    render(<TestForm />);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'alice' } });

    expect(input).toHaveValue('alice');
  });

  it('uses field name as input id', () => {
    render(<TestForm />);

    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'username');
  });
});
