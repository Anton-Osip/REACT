import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchForm } from './search-form';

describe('SearchForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders search input and submit button', () => {
    const submitInput = vi.fn();
    render(<SearchForm submitInput={submitInput} />);

    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('shows default value from props when provided', () => {
    const submitInput = vi.fn();
    render(<SearchForm submitInput={submitInput} defaultValue="pickle rick" />);

    expect(screen.getByPlaceholderText('Search')).toHaveValue('pickle rick');
  });

  it('shows empty input when default value is not provided', () => {
    const submitInput = vi.fn();
    render(<SearchForm submitInput={submitInput} />);

    expect(screen.getByPlaceholderText('Search')).toHaveValue('');
  });

  it('syncs input when defaultValue prop changes', () => {
    const submitInput = vi.fn();
    const { rerender } = render(
      <SearchForm submitInput={submitInput} defaultValue="alpha" />
    );
    expect(screen.getByPlaceholderText('Search')).toHaveValue('alpha');

    rerender(<SearchForm submitInput={submitInput} defaultValue="beta" />);
    expect(screen.getByPlaceholderText('Search')).toHaveValue('beta');
  });

  it('updates input value when user types', async () => {
    const submitInput = vi.fn();
    render(<SearchForm submitInput={submitInput} />);
    const input = screen.getByPlaceholderText('Search');

    await user.type(input, 'summer');

    expect(input).toHaveValue('summer');
  });

  it('calls submitInput with trimmed value on submit', async () => {
    const submitInput = vi.fn();
    render(<SearchForm submitInput={submitInput} />);
    const input = screen.getByPlaceholderText('Search');

    await user.type(input, '  beth  ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(submitInput).toHaveBeenCalledWith('beth');
  });

  it('calls submitInput with empty string when submitting empty input', async () => {
    const submitInput = vi.fn();
    render(<SearchForm submitInput={submitInput} defaultValue="old" />);
    const input = screen.getByPlaceholderText('Search');

    await user.clear(input);
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(submitInput).toHaveBeenCalledWith('');
  });

  it('does not call submitInput when input is only whitespace', async () => {
    const submitInput = vi.fn();
    render(<SearchForm submitInput={submitInput} />);
    const input = screen.getByPlaceholderText('Search');

    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(submitInput).not.toHaveBeenCalled();
  });

  it('notifies parent with new search term on submit', async () => {
    const submitInput = vi.fn();
    render(<SearchForm submitInput={submitInput} defaultValue="first" />);
    const input = screen.getByPlaceholderText('Search');

    await user.clear(input);
    await user.type(input, 'second');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(submitInput).toHaveBeenLastCalledWith('second');
  });
});
