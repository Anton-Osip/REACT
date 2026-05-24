import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { CharactersResponse } from '@/features/character/api';
import { getCharacters } from '@/features/character/api';

import { toCharacterPreview } from '../toCharacterPreview.ts';

import { useCharacterListStore } from './character-list.state.ts';

vi.mock('@/features/character/api', () => ({
  getCharacters: vi.fn(),
}));

const mockedGetCharacters = vi.mocked(getCharacters);

const mockCharactersResponse: CharactersResponse = {
  info: {
    count: 1,
    pages: 1,
    next: null,
    prev: null,
  },
  results: [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth', url: 'https://example.com/origin' },
      location: { name: 'Earth', url: 'https://example.com/location' },
      image: 'https://example.com/rick.png',
      episode: ['https://example.com/episode/1'],
      url: 'https://example.com/character/1',
      created: '2017-11-04T18:48:46.250Z',
    },
  ],
};

const mockCharacter = mockCharactersResponse.results[0];

function resetStore() {
  useCharacterListStore.setState({
    characters: null,
    charactersIsLoading: false,
    charactersIsError: null,
    selectedCharacters: null,
  });
}

describe('useCharacterListStore', () => {
  beforeEach(() => {
    resetStore();
    mockedGetCharacters.mockReset();
  });

  it('starts with empty data and no loading or error flags', () => {
    expect(useCharacterListStore.getState()).toMatchObject({
      characters: null,
      charactersIsLoading: false,
      charactersIsError: null,
      selectedCharacters: null,
    });
  });

  it('sets loading state when fetch starts', async () => {
    mockedGetCharacters.mockReturnValue(new Promise(() => {}));

    void useCharacterListStore.getState().fetchCharacters({ name: 'rick' });

    expect(useCharacterListStore.getState()).toMatchObject({
      characters: null,
      charactersIsLoading: true,
      charactersIsError: null,
    });
  });

  it('stores response and stops loading on successful fetch', async () => {
    mockedGetCharacters.mockResolvedValue(mockCharactersResponse);

    await useCharacterListStore.getState().fetchCharacters({ name: 'rick' });

    expect(useCharacterListStore.getState()).toMatchObject({
      characters: {
        info: mockCharactersResponse.info,
        results: mockCharactersResponse.results.map(toCharacterPreview),
      },
      charactersIsLoading: false,
      charactersIsError: null,
    });
    expect(mockedGetCharacters).toHaveBeenCalledWith('rick', undefined);
  });

  it('clears characters and stores error on failed fetch', async () => {
    const error = new Error('Network failed');
    mockedGetCharacters.mockRejectedValue(error);

    await useCharacterListStore.getState().fetchCharacters({ page: 2 });

    expect(useCharacterListStore.getState()).toMatchObject({
      characters: null,
      charactersIsLoading: false,
      charactersIsError: error,
    });
    expect(mockedGetCharacters).toHaveBeenCalledWith(undefined, 2);
  });

  it('wraps non-Error rejections in Error', async () => {
    mockedGetCharacters.mockRejectedValue('plain string failure');

    await useCharacterListStore.getState().fetchCharacters({});

    expect(useCharacterListStore.getState().charactersIsError).toEqual(
      new Error('plain string failure')
    );
  });

  it('adds character to selectedCharacters on toggle', () => {
    useCharacterListStore.getState().toggleCharacterSelected(mockCharacter);

    const { selectedCharacters } = useCharacterListStore.getState();
    expect(selectedCharacters?.has(mockCharacter.id)).toBe(true);
    expect(selectedCharacters?.get(mockCharacter.id)).toEqual(mockCharacter);
  });

  it('removes character from selectedCharacters when toggled again', () => {
    const { toggleCharacterSelected } = useCharacterListStore.getState();

    toggleCharacterSelected(mockCharacter);
    toggleCharacterSelected(mockCharacter);

    const { selectedCharacters } = useCharacterListStore.getState();
    expect(selectedCharacters?.has(mockCharacter.id)).toBe(false);
  });

  it('keeps multiple selected characters independently', () => {
    const secondCharacter = {
      ...mockCharacter,
      id: 2,
      name: 'Morty Smith',
    };

    useCharacterListStore.getState().toggleCharacterSelected(mockCharacter);
    useCharacterListStore.getState().toggleCharacterSelected(secondCharacter);

    const { selectedCharacters } = useCharacterListStore.getState();
    expect(selectedCharacters?.size).toBe(2);
    expect(selectedCharacters?.has(1)).toBe(true);
    expect(selectedCharacters?.has(2)).toBe(true);
  });

  it('clears all selected characters on resetCharacterSelected', () => {
    useCharacterListStore.getState().toggleCharacterSelected(mockCharacter);
    useCharacterListStore.getState().resetCharacterSelected();

    expect(useCharacterListStore.getState().selectedCharacters).toBeNull();
  });

  it('does not mutate previous selectedCharacters map', () => {
    useCharacterListStore.getState().toggleCharacterSelected(mockCharacter);
    const firstMap = useCharacterListStore.getState().selectedCharacters;

    useCharacterListStore
      .getState()
      .toggleCharacterSelected({ ...mockCharacter, id: 2, name: 'Morty' });

    expect(firstMap?.has(2)).toBe(false);
    expect(useCharacterListStore.getState().selectedCharacters?.has(2)).toBe(
      true
    );
  });
});
