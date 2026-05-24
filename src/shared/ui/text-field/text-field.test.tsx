import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TextField } from './text-field.tsx';

describe('TextField', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a text input', () => {
    render(<TextField />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<TextField label="Username" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('notifies onChange when value changes', () => {
    const handleChange = vi.fn();
    render(<TextField onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('test value');
  });

  it('shows error text when errorText is provided', () => {
    render(<TextField isError errorText="This field is required" />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('does not render error line when errorText is absent', () => {
    render(<TextField isError />);

    expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
  });

  it('renders end icon button and calls buttonIconActionEnd on click', () => {
    const handleClick = vi.fn();
    render(
      <TextField
        buttonIconEnd={<span>🔍</span>}
        buttonIconActionEnd={handleClick}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('🔍');

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders iconStart inside the field layout', () => {
    render(<TextField iconStart={<span data-testid="start-icon">◎</span>} />);

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  it('renders password field', () => {
    const { container } = render(<TextField type="password" />);

    const input = container.querySelector('input[type="password"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });

  it('passes through input attributes', () => {
    render(<TextField placeholder="Enter your name" disabled maxLength={50} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter your name');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('maxLength', '50');
  });

  it('supports controlled value', () => {
    const { rerender } = render(<TextField value="a" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('a');

    rerender(<TextField value="b" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('b');
  });
});
