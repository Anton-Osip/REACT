import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CheckboxField } from './checkbox-field.tsx';

describe('CheckboxField', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders checkbox without label when label is omitted', () => {
    render(
      <CheckboxField checked={false} onCheckedChange={vi.fn()} id="terms" />
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.queryByText('Accept terms')).not.toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(
      <CheckboxField
        checked={false}
        onCheckedChange={vi.fn()}
        id="terms"
        label="Accept terms"
      />
    );

    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('calls onCheckedChange when toggled', () => {
    const onCheckedChange = vi.fn();
    render(
      <CheckboxField
        checked={false}
        onCheckedChange={onCheckedChange}
        id="terms"
        label="Accept terms"
      />
    );

    fireEvent.click(screen.getByRole('checkbox'));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('renders error text when provided', () => {
    render(
      <CheckboxField
        checked={false}
        onCheckedChange={vi.fn()}
        errorText="Required field"
      />
    );

    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('calls onBlur when checkbox loses focus', () => {
    const onBlur = vi.fn();
    render(
      <CheckboxField
        checked={false}
        onCheckedChange={vi.fn()}
        onBlur={onBlur}
        id="terms"
      />
    );

    fireEvent.blur(screen.getByRole('checkbox'));

    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
