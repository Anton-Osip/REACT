import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { CharacterResponse } from '@/features/character/api';
import { getCharacterDetails } from '@/features/character/api';

import { toCharacterPreview } from '../toCharacterPreview.ts';

import { useCharacterDetailsStore } from './character-details.state.ts';

vi.mock('@/features/character/api', () => ({
  getCharacterDetails: vi.fn(),
}));

const mockedGetCharacterDetails = vi.mocked(getCharacterDetails);

const mockCharacter: CharacterResponse = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth', url: 'https://example.com/origin' },
  location: { name: 'Citadel of Ricks', url: 'https://example.com/location' },
  image: 'https://example.com/rick.png',
  episode: ['https://example.com/episode/1'],
  url: 'https://example.com/character/1',
  created: '2017-11-04T18:48:46.250Z',
};

function resetStore() {
  useCharacterDetailsStore.setState({
    characterDetails: null,
    charactersIsLoading: false,
    charactersIsError: null,
  });
}

describe('useCharacterDetailsStore', () => {
  beforeEach(() => {
    resetStore();
    mockedGetCharacterDetails.mockReset();
  });

  it('starts with empty data and no loading or error flags', () => {
    expect(useCharacterDetailsStore.getState()).toMatchObject({
      characterDetails: null,
      charactersIsLoading: false,
      charactersIsError: null,
    });
  });

  it('sets loading state when fetch starts', async () => {
    mockedGetCharacterDetails.mockReturnValue(new Promise(() => {}));

    void useCharacterDetailsStore
      .getState()
      .fetchCharactersDetails({ characterId: 1 });

    expect(useCharacterDetailsStore.getState()).toMatchObject({
      characterDetails: null,
      charactersIsLoading: true,
      charactersIsError: null,
    });
  });

  it('stores response and stops loading on successful fetch', async () => {
    mockedGetCharacterDetails.mockResolvedValue(mockCharacter);

    await useCharacterDetailsStore
      .getState()
      .fetchCharactersDetails({ characterId: 1 });

    expect(useCharacterDetailsStore.getState()).toMatchObject({
      characterDetails: toCharacterPreview(mockCharacter),
      charactersIsLoading: false,
      charactersIsError: null,
    });
    expect(mockedGetCharacterDetails).toHaveBeenCalledWith(1);
  });

  it('clears details and stores error on failed fetch', async () => {
    const error = new Error('Network failed');
    mockedGetCharacterDetails.mockRejectedValue(error);

    await useCharacterDetailsStore
      .getState()
      .fetchCharactersDetails({ characterId: 42 });

    expect(useCharacterDetailsStore.getState()).toMatchObject({
      characterDetails: null,
      charactersIsLoading: false,
      charactersIsError: error,
    });
    expect(mockedGetCharacterDetails).toHaveBeenCalledWith(42);
  });

  it('wraps non-Error rejections in Error', async () => {
    mockedGetCharacterDetails.mockRejectedValue('plain string failure');

    await useCharacterDetailsStore
      .getState()
      .fetchCharactersDetails({ characterId: 1 });

    expect(useCharacterDetailsStore.getState().charactersIsError).toEqual(
      new Error('plain string failure')
    );
  });
});
