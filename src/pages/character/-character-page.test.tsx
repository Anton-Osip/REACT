import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getCharacters } from '@/api/character';
import { createCharactersResponse, renderWithRouter } from '@/test-utils';
import { loadFromStorage } from '@/utils';

import { STORAGE_KEY } from './route.tsx';

vi.mock('../../utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../utils')>();
  return {
    ...actual,
    loadFromStorage: vi.fn(),
  };
});

vi.mock('../../api/character', () => ({
  getCharacters: vi.fn(),
}));

const mockedLoadFromStorage = vi.mocked(loadFromStorage);
const mockedGetCharacters = vi.mocked(getCharacters);

describe('CharacterPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
    localStorage.clear();
    mockedLoadFromStorage.mockReset();
    mockedLoadFromStorage.mockReturnValue('');
    mockedGetCharacters.mockReset();
    mockedGetCharacters.mockResolvedValue(createCharactersResponse());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('loads saved search term from storage on mount', async () => {
    mockedLoadFromStorage.mockReturnValue('portal gun');

    renderWithRouter('/character');

    expect(mockedLoadFromStorage).toHaveBeenCalledWith(STORAGE_KEY, '');
    expect(await screen.findByPlaceholderText('Search')).toHaveValue(
      'portal gun'
    );
    await waitFor(() => expect(mockedGetCharacters).toHaveBeenCalled());
  });

  it('uses search from URL when present, not localStorage', async () => {
    mockedLoadFromStorage.mockReturnValue('portal gun');

    renderWithRouter('/character?search=summer');

    expect(await screen.findByPlaceholderText('Search')).toHaveValue('summer');
    await waitFor(() =>
      expect(mockedGetCharacters).toHaveBeenCalledWith('summer', 1)
    );
  });

  it('uses undefined search in API when storage has no saved value', async () => {
    mockedLoadFromStorage.mockReturnValue('');

    renderWithRouter('/character');

    expect(await screen.findByPlaceholderText('Search')).toHaveValue('');
    await waitFor(() =>
      expect(mockedGetCharacters).toHaveBeenCalledWith(undefined, 1)
    );
  });

  it('updates list when user submits a new search', async () => {
    mockedLoadFromStorage.mockReturnValue('');
    mockedGetCharacters.mockResolvedValue(createCharactersResponse());

    renderWithRouter('/character');

    await screen.findByText('Rick Sanchez');

    mockedGetCharacters.mockResolvedValue(
      createCharactersResponse({
        results: [
          {
            type: '',
            gender: 'Female',
            origin: { name: '', url: '' },
            episode: [],
            url: '',
            created: '',
            id: 9,
            name: 'Summer Smith',
            status: 'Alive',
            species: 'Human',
            location: { name: 'Earth', url: '' },
            image: 'https://example.com/summer.png',
          },
        ],
      })
    );

    const input = screen.getByPlaceholderText('Search');
    await user.clear(input);
    await user.type(input, 'summer');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText('Summer Smith')).toBeInTheDocument();
    expect(mockedGetCharacters).toHaveBeenLastCalledWith('summer', 1);
  });
});
