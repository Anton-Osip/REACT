import { describe, expect, it } from 'vitest';

import type { Character } from '@/features/character/api';

import { toCharacterPreview } from './toCharacterPreview.ts';

const fullCharacter: Character = {
  id: 7,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'https://example.com/rick.png',
  episode: [],
  url: '',
  created: '',
};

describe('toCharacterPreview', () => {
  it('maps character to preview shape', () => {
    expect(toCharacterPreview(fullCharacter)).toEqual({
      id: 7,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      image: 'https://example.com/rick.png',
      location: { name: 'Citadel of Ricks', url: '' },
      gender: 'Male',
    });
  });
});
