import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_KEY } from '@/features/character/model/constants.ts';
import {
  createCharactersResponse,
  createSuccessCharactersQuery,
  renderWithRouter,
  useGetCharactersMock,
} from '@/shared/test-utils';
import { loadFromStorage } from '@/shared/utils';

vi.mock('@/shared/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/utils')>();
  return {
    ...actual,
    loadFromStorage: vi.fn(),
  };
});

const mockedLoadFromStorage = vi.mocked(loadFromStorage);

describe('CharacterPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
    localStorage.clear();
    mockedLoadFromStorage.mockReset();
    mockedLoadFromStorage.mockReturnValue('');
    useGetCharactersMock.mockReset();
    useGetCharactersMock.mockReturnValue(
      createSuccessCharactersQuery(createCharactersResponse())
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('loads saved search term from storage on mount', async () => {
    mockedLoadFromStorage.mockReturnValue('portal gun');

    await renderWithRouter('/character');

    expect(mockedLoadFromStorage).toHaveBeenCalledWith(STORAGE_KEY, '');
    expect(await screen.findByPlaceholderText('Search')).toHaveValue(
      'portal gun'
    );
    await waitFor(() => expect(useGetCharactersMock).toHaveBeenCalled());
  });

  it('uses search from URL when present, not localStorage', async () => {
    mockedLoadFromStorage.mockReturnValue('portal gun');

    await renderWithRouter('/character?search=summer');

    expect(await screen.findByPlaceholderText('Search')).toHaveValue('summer');
    await waitFor(() =>
      expect(useGetCharactersMock).toHaveBeenCalledWith({
        name: 'summer',
        page: 1,
      })
    );
  });

  it('uses undefined search in API when storage has no saved value', async () => {
    mockedLoadFromStorage.mockReturnValue('');

    await renderWithRouter('/character');

    expect(await screen.findByPlaceholderText('Search')).toHaveValue('');
    await waitFor(() =>
      expect(useGetCharactersMock).toHaveBeenCalledWith({
        name: undefined,
        page: 1,
      })
    );
  });

  it('updates list when user submits a new search', async () => {
    mockedLoadFromStorage.mockReturnValue('');

    await renderWithRouter('/character');

    await screen.findByText('Rick Sanchez');

    useGetCharactersMock.mockReturnValue(
      createSuccessCharactersQuery(
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
      )
    );

    const input = screen.getByPlaceholderText('Search');
    await user.clear(input);
    await user.type(input, 'summer');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText('Summer Smith')).toBeInTheDocument();
    expect(useGetCharactersMock).toHaveBeenLastCalledWith({
      name: 'summer',
      page: 1,
    });
  });
});
