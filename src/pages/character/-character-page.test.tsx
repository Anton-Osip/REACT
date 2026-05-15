import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { routeTree } from '../../routeTree.gen';
import { STORAGE_KEY } from './-character-page.tsx';
import { loadFromStorage } from '../../utils';
import { getCharacters } from '../../api/character';
import { createCharactersResponse } from '../../test-utils';

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

function renderAppAt(initialLocation = '/') {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialLocation] }),
  } as unknown as Parameters<typeof createRouter>[0]);
  return {
    router,
    ...render(<RouterProvider router={router} />),
  };
}

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

    renderAppAt('/');

    expect(mockedLoadFromStorage).toHaveBeenCalledWith(STORAGE_KEY, '');
    expect(await screen.findByPlaceholderText('Search')).toHaveValue(
      'portal gun'
    );
    await waitFor(() => expect(mockedGetCharacters).toHaveBeenCalled());
  });

  it('uses search from URL when present, not localStorage', async () => {
    mockedLoadFromStorage.mockReturnValue('portal gun');

    renderAppAt('/?search=summer');

    expect(await screen.findByPlaceholderText('Search')).toHaveValue('summer');
    await waitFor(() =>
      expect(mockedGetCharacters).toHaveBeenCalledWith('summer', 1)
    );
  });

  it('uses undefined search in API when storage has no saved value', async () => {
    mockedLoadFromStorage.mockReturnValue('');

    renderAppAt('/');

    expect(await screen.findByPlaceholderText('Search')).toHaveValue('');
    await waitFor(() =>
      expect(mockedGetCharacters).toHaveBeenCalledWith(undefined, 1)
    );
  });

  it('updates list when user submits a new search', async () => {
    mockedLoadFromStorage.mockReturnValue('');
    mockedGetCharacters.mockResolvedValue(createCharactersResponse());

    renderAppAt('/');

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
