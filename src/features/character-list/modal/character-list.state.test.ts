import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CharactersResponse } from '../../../api/character';
import { getCharacters } from '../../../api/character';
import { useCharacterListStore } from './character-list.state';

vi.mock('../../../api/character', () => ({
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

function resetStore() {
  useCharacterListStore.setState({
    characters: null,
    charactersIsLoading: false,
    charactersIsError: null,
    shouldThrowError: false,
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
      shouldThrowError: false,
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
      characters: mockCharactersResponse,
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

  it('sets shouldThrowError on simulateError', () => {
    useCharacterListStore.getState().simulateError();

    expect(useCharacterListStore.getState().shouldThrowError).toBe(true);
  });

  it('clears shouldThrowError on resetSimulatedError', () => {
    useCharacterListStore.getState().simulateError();
    useCharacterListStore.getState().resetSimulatedError();

    expect(useCharacterListStore.getState().shouldThrowError).toBe(false);
  });
});
