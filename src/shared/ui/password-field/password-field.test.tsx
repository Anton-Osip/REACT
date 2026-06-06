import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { PasswordField } from './password-field.tsx';

describe('PasswordField', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a password input by default', () => {
    const { container } = render(<PasswordField />);

    const input = container.querySelector('input[type="password"]');
    expect(input).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<PasswordField label="Password" />);

    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('toggles password visibility when end button is clicked', () => {
    const { container } = render(<PasswordField />);

    expect(
      container.querySelector('input[type="password"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('input[type="text"]')
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));

    expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    expect(
      container.querySelector('input[type="password"]')
    ).not.toBeInTheDocument();
  });

  it('shows error text when errorText is provided', () => {
    render(<PasswordField isError errorText="Password is required" />);

    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });
});
