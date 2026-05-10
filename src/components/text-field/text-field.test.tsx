import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { TextField } from './text-field';

describe('TextField', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders input element correctly', () => {
    render(<TextField />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders with label when provided', () => {
    render(<TextField label="Username" />);
    const label = screen.getByText('Username');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('P');
  });

  it('handles text input correctly', () => {
    const handleChange = vi.fn();
    render(<TextField onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('test value');
  });

  it('displays error text when isError is true', () => {
    render(<TextField isError errorText="This field is required" />);

    const errorText = screen.getByText('This field is required');
    expect(errorText).toBeInTheDocument();
  });

  it('renders end button and calls action on click', () => {
    const handleClick = vi.fn();
    render(
      <TextField
        buttonIconEnd={<span>🔍</span>}
        buttonIconActionEnd={handleClick}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('🔍');

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders password input when type is password', () => {
    render(<TextField type="password" />);

    const input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('applies additional input attributes correctly', () => {
    render(<TextField placeholder="Enter your name" disabled maxLength={50} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter your name');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('maxLength', '50');
  });
});
