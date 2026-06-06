import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { afterEach, describe, expect, it } from 'vitest';

import { CheckboxFieldController } from '@/shared/ui';

type FormValues = {
  agree: boolean;
};

const TestForm = () => {
  const { control } = useForm<FormValues>({
    defaultValues: { agree: false },
  });

  return (
    <CheckboxFieldController name="agree" control={control} label="I agree" />
  );
};

describe('CheckboxFieldController', () => {
  afterEach(() => {
    cleanup();
  });

  it('connects checkbox to react-hook-form field', () => {
    render(<TestForm />);

    expect(screen.getByRole('checkbox')).not.toBeChecked();

    fireEvent.click(screen.getByRole('checkbox'));

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('uses field name as checkbox id', () => {
    render(<TestForm />);

    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'agree');
  });
});
