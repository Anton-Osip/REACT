import { beforeEach, describe, expect, it } from 'vitest';

import type { CharacterPreview } from '@/features/character/api';

import { toCharacterPreview } from '../toCharacterPreview.ts';

import { useSelectedCharacterStore } from './selected-character.state.ts';

const mockCharacter: CharacterPreview = toCharacterPreview({
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
});

function resetStore() {
  useSelectedCharacterStore.setState({ selectedCharactersMap: null });
}

describe('useSelectedCharacterStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('starts with no selected characters', () => {
    expect(
      useSelectedCharacterStore.getState().selectedCharactersMap
    ).toBeNull();
  });

  it('adds character to selectedCharactersMap on toggle', () => {
    useSelectedCharacterStore.getState().toggleCharacterSelected(mockCharacter);

    const { selectedCharactersMap } = useSelectedCharacterStore.getState();
    expect(selectedCharactersMap?.has(mockCharacter.id)).toBe(true);
    expect(selectedCharactersMap?.get(mockCharacter.id)).toEqual(mockCharacter);
  });

  it('removes character from selectedCharactersMap when toggled again', () => {
    const { toggleCharacterSelected } = useSelectedCharacterStore.getState();

    toggleCharacterSelected(mockCharacter);
    toggleCharacterSelected(mockCharacter);

    const { selectedCharactersMap } = useSelectedCharacterStore.getState();
    expect(selectedCharactersMap?.has(mockCharacter.id)).toBe(false);
  });

  it('keeps multiple selected characters independently', () => {
    const secondCharacter: CharacterPreview = {
      ...mockCharacter,
      id: 2,
      name: 'Morty Smith',
    };

    useSelectedCharacterStore.getState().toggleCharacterSelected(mockCharacter);
    useSelectedCharacterStore
      .getState()
      .toggleCharacterSelected(secondCharacter);

    const { selectedCharactersMap } = useSelectedCharacterStore.getState();
    expect(selectedCharactersMap?.size).toBe(2);
    expect(selectedCharactersMap?.has(1)).toBe(true);
    expect(selectedCharactersMap?.has(2)).toBe(true);
  });

  it('clears all selected characters on resetCharacterSelected', () => {
    useSelectedCharacterStore.getState().toggleCharacterSelected(mockCharacter);
    useSelectedCharacterStore.getState().resetCharacterSelected();

    expect(
      useSelectedCharacterStore.getState().selectedCharactersMap
    ).toBeNull();
  });

  it('does not mutate previous selectedCharactersMap map', () => {
    useSelectedCharacterStore.getState().toggleCharacterSelected(mockCharacter);
    const firstMap = useSelectedCharacterStore.getState().selectedCharactersMap;

    useSelectedCharacterStore
      .getState()
      .toggleCharacterSelected({ ...mockCharacter, id: 2, name: 'Morty' });

    expect(firstMap?.has(2)).toBe(false);
    expect(
      useSelectedCharacterStore.getState().selectedCharactersMap?.has(2)
    ).toBe(true);
  });
});
