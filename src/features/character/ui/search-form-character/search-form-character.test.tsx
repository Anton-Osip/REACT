import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getCharacters } from '@/features/character/api';
import { STORAGE_KEY } from '@/features/character/model/constants.ts';
import {
  createCharactersResponse,
  renderWithRouter,
} from '@/shared/test-utils';
import { saveToStorage } from '@/shared/utils';

vi.mock('@/features/character/api', () => ({
  getCharacters: vi.fn(),
}));

vi.mock('@/shared/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/utils')>();
  return {
    ...actual,
    saveToStorage: vi.fn(),
  };
});

const mockedSaveToStorage = vi.mocked(saveToStorage);
const mockedGetCharacters = vi.mocked(getCharacters);

describe('SearchFormCharacter', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
    localStorage.clear();
    mockedSaveToStorage.mockReset();
    mockedGetCharacters.mockReset();
    mockedGetCharacters.mockResolvedValue(createCharactersResponse());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders search input and submit button', async () => {
    renderWithRouter('/character');

    expect(await screen.findByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('shows default value from props when provided', async () => {
    renderWithRouter('/character?search=pickle%20rick');

    expect(await screen.findByPlaceholderText('Search')).toHaveValue(
      'pickle rick'
    );
  });

  it('shows empty input when default value is not provided', async () => {
    renderWithRouter('/character');

    expect(await screen.findByPlaceholderText('Search')).toHaveValue('');
  });

  it('syncs input when defaultValue prop changes', async () => {
    const { router } = renderWithRouter('/character?search=alpha');

    expect(await screen.findByPlaceholderText('Search')).toHaveValue('alpha');

    await router.navigate({
      to: '/character',
      search: { search: 'beta', page: 1 },
    });

    await waitFor(() =>
      expect(screen.getByPlaceholderText('Search')).toHaveValue('beta')
    );
  });

  it('updates input value when user types', async () => {
    renderWithRouter('/character');
    const input = await screen.findByPlaceholderText('Search');

    await user.type(input, 'summer');

    expect(input).toHaveValue('summer');
  });

  it('saves trimmed value and updates URL search on submit', async () => {
    const { router } = renderWithRouter('/character');
    const input = await screen.findByPlaceholderText('Search');

    await user.type(input, '  beth  ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(mockedSaveToStorage).toHaveBeenCalledWith(STORAGE_KEY, 'beth');
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({
        search: 'beth',
        page: 1,
      })
    );
    expect(input).toHaveValue('beth');
  });

  it('saves empty string and clears URL search when submitting empty input', async () => {
    const { router } = renderWithRouter('/character?search=old');
    const input = await screen.findByPlaceholderText('Search');

    await user.clear(input);
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(mockedSaveToStorage).toHaveBeenCalledWith(STORAGE_KEY, '');
    await waitFor(() => {
      expect(router.state.location.search).toMatchObject({ page: 1 });
      expect(router.state.location.search.search ?? '').toBe('');
    });
  });

  it('does not save or navigate when input is only whitespace', async () => {
    const { router } = renderWithRouter('/character');
    const input = await screen.findByPlaceholderText('Search');

    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(mockedSaveToStorage).not.toHaveBeenCalledWith(
      STORAGE_KEY,
      expect.anything()
    );
    expect(router.state.location.search).toMatchObject({ page: 1 });
  });

  it('updates URL search with new term on submit', async () => {
    const { router } = renderWithRouter('/character?search=first');
    const input = await screen.findByPlaceholderText('Search');

    await user.clear(input);
    await user.type(input, 'second');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({
        search: 'second',
        page: 1,
      })
    );
    expect(mockedSaveToStorage).toHaveBeenLastCalledWith(STORAGE_KEY, 'second');
  });
});
