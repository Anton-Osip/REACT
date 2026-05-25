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
  useSelectedCharacterStore.setState({ selectedCharacters: null });
}

describe('useSelectedCharacterStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('starts with no selected characters', () => {
    expect(useSelectedCharacterStore.getState().selectedCharacters).toBeNull();
  });

  it('adds character to selectedCharacters on toggle', () => {
    useSelectedCharacterStore.getState().toggleCharacterSelected(mockCharacter);

    const { selectedCharacters } = useSelectedCharacterStore.getState();
    expect(selectedCharacters?.has(mockCharacter.id)).toBe(true);
    expect(selectedCharacters?.get(mockCharacter.id)).toEqual(mockCharacter);
  });

  it('removes character from selectedCharacters when toggled again', () => {
    const { toggleCharacterSelected } = useSelectedCharacterStore.getState();

    toggleCharacterSelected(mockCharacter);
    toggleCharacterSelected(mockCharacter);

    const { selectedCharacters } = useSelectedCharacterStore.getState();
    expect(selectedCharacters?.has(mockCharacter.id)).toBe(false);
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

    const { selectedCharacters } = useSelectedCharacterStore.getState();
    expect(selectedCharacters?.size).toBe(2);
    expect(selectedCharacters?.has(1)).toBe(true);
    expect(selectedCharacters?.has(2)).toBe(true);
  });

  it('clears all selected characters on resetCharacterSelected', () => {
    useSelectedCharacterStore.getState().toggleCharacterSelected(mockCharacter);
    useSelectedCharacterStore.getState().resetCharacterSelected();

    expect(useSelectedCharacterStore.getState().selectedCharacters).toBeNull();
  });

  it('does not mutate previous selectedCharacters map', () => {
    useSelectedCharacterStore.getState().toggleCharacterSelected(mockCharacter);
    const firstMap = useSelectedCharacterStore.getState().selectedCharacters;

    useSelectedCharacterStore
      .getState()
      .toggleCharacterSelected({ ...mockCharacter, id: 2, name: 'Morty' });

    expect(firstMap?.has(2)).toBe(false);
    expect(
      useSelectedCharacterStore.getState().selectedCharacters?.has(2)
    ).toBe(true);
  });
});
