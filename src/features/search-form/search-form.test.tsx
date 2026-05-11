import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchForm, STORAGE_KEY } from './search-form';
import * as storageUtils from '../../utils/SaveToStorage';

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

  it('updates input value when user types', async () => {
    const submitInput = vi.fn();
    render(<SearchForm submitInput={submitInput} />);
    const input = screen.getByPlaceholderText('Search');

    await user.type(input, 'summer');

    expect(input).toHaveValue('summer');
  });

  it('persists trimmed search term and notifies parent on submit', async () => {
    const submitInput = vi.fn();
    const saveSpy = vi.spyOn(storageUtils, 'saveToStorage');

    render(<SearchForm submitInput={submitInput} />);
    const input = screen.getByPlaceholderText('Search');

    await user.type(input, '  beth  ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(saveSpy).toHaveBeenCalledWith(STORAGE_KEY, 'beth');
    expect(submitInput).toHaveBeenCalledWith('beth');
  });

  it('clears storage and notifies parent when submitting empty input', async () => {
    const submitInput = vi.fn();
    const saveSpy = vi.spyOn(storageUtils, 'saveToStorage');

    render(<SearchForm submitInput={submitInput} defaultValue="old" />);
    const input = screen.getByPlaceholderText('Search');

    await user.clear(input);
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(saveSpy).toHaveBeenCalledWith(STORAGE_KEY, '');
    expect(submitInput).toHaveBeenCalledWith('');
  });

  it('does not call submitInput with trimmed value when input is only whitespace', async () => {
    const submitInput = vi.fn();
    render(<SearchForm submitInput={submitInput} />);
    const input = screen.getByPlaceholderText('Search');

    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(submitInput).not.toHaveBeenCalled();
  });

  it('overwrites existing localStorage value after a new search', async () => {
    const submitInput = vi.fn();
    localStorage.setItem(STORAGE_KEY, JSON.stringify('first'));

    render(<SearchForm submitInput={submitInput} defaultValue="first" />);
    const input = screen.getByPlaceholderText('Search');

    await user.clear(input);
    await user.type(input, 'second');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '""')).toBe(
      'second'
    );
    expect(submitInput).toHaveBeenLastCalledWith('second');
  });
});
