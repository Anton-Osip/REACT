import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RadioField } from './radio-field.tsx';

const options = [
  { value: 'basic', label: 'Basic' },
  { value: 'pro', label: 'Pro', disabled: true },
];

describe('RadioField', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders radio options', () => {
    render(
      <RadioField
        name="plan"
        value="basic"
        onChange={vi.fn()}
        options={options}
      />
    );

    expect(screen.getByLabelText('Basic')).toBeInTheDocument();
    expect(screen.getByLabelText('Pro')).toBeInTheDocument();
  });

  it('renders field label when provided', () => {
    render(
      <RadioField
        name="plan"
        value="basic"
        onChange={vi.fn()}
        options={options}
        label="Choose plan"
      />
    );

    expect(screen.getByText('Choose plan')).toBeInTheDocument();
  });

  it('calls onChange when another option is selected', () => {
    const onChange = vi.fn();
    render(
      <RadioField
        name="plan"
        value="basic"
        onChange={onChange}
        options={[
          { value: 'basic', label: 'Basic' },
          { value: 'pro', label: 'Pro' },
        ]}
      />
    );

    fireEvent.click(screen.getByLabelText('Pro'));

    expect(onChange).toHaveBeenCalledWith('pro');
  });

  it('renders error text when provided', () => {
    render(
      <RadioField
        name="plan"
        value=""
        onChange={vi.fn()}
        options={options}
        errorText="Select a plan"
      />
    );

    expect(screen.getByText('Select a plan')).toBeInTheDocument();
  });

  it('calls onBlur when a radio loses focus', () => {
    const onBlur = vi.fn();
    render(
      <RadioField
        name="plan"
        value="basic"
        onChange={vi.fn()}
        onBlur={onBlur}
        options={[{ value: 'basic', label: 'Basic' }]}
      />
    );

    fireEvent.blur(screen.getByRole('radio'));

    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
