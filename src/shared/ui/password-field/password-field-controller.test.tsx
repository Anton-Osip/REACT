import { cleanup, fireEvent, render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { afterEach, describe, expect, it } from 'vitest';

import { PasswordFieldController } from '@/shared/ui';

type FormValues = {
  password: string;
};

const TestForm = () => {
  const { control } = useForm<FormValues>({
    defaultValues: { password: '' },
  });

  return (
    <PasswordFieldController
      name="password"
      control={control}
      label="Password"
    />
  );
};

describe('PasswordFieldController', () => {
  afterEach(() => {
    cleanup();
  });

  it('connects password input to react-hook-form field', () => {
    const { container } = render(<TestForm />);

    const input = container.querySelector('input') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'secret123' } });

    expect(input).toHaveValue('secret123');
  });

  it('uses field name as input id', () => {
    const { container } = render(<TestForm />);

    expect(container.querySelector('input')).toHaveAttribute('id', 'password');
  });
});
