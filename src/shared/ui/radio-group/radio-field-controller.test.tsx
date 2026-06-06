import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { afterEach, describe, expect, it } from 'vitest';

import { RadioFieldController } from './radio-field-controller.tsx';

type FormValues = {
  plan: string;
};

const options = [
  { value: 'basic', label: 'Basic' },
  { value: 'pro', label: 'Pro' },
];

const TestForm = () => {
  const { control } = useForm<FormValues>({
    defaultValues: { plan: 'basic' },
  });

  return (
    <RadioFieldController name="plan" control={control} options={options} />
  );
};

describe('RadioFieldController', () => {
  afterEach(() => {
    cleanup();
  });

  it('connects radio group to react-hook-form field', () => {
    render(<TestForm />);

    expect(screen.getByLabelText('Basic')).toBeChecked();

    fireEvent.click(screen.getByLabelText('Pro'));

    expect(screen.getByLabelText('Pro')).toBeChecked();
    expect(screen.getByLabelText('Basic')).not.toBeChecked();
  });
});
