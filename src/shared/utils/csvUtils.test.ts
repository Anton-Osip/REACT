import { describe, expect, it } from 'vitest';

import { createCharactersResponse } from '@/shared/test-utils';

import type {
  Character,
  CharacterPreview,
} from '../../features/character/api/getCharacters.type.ts';

import { generateCSV } from './csvUtils.ts';

describe('generateCSV', () => {
  const [rick, morty] = createCharactersResponse().results;

  const toPreview = (character: Character): CharacterPreview => ({
    id: character.id,
    name: character.name,
    status: character.status,
    species: character.species,
    image: character.image,
    location: character.location,
    gender: character.gender,
  });

  it('includes header row with expected columns', () => {
    const csv = generateCSV([]);

    expect(csv.split('\n')[0]).toBe(
      'ID,Name,Status,Species,Location Name,Location URL,Image URL'
    );
  });

  it('returns only headers when items array is empty', () => {
    expect(generateCSV([])).not.toContain('\n\n');
    expect(generateCSV([]).split('\n')).toHaveLength(1);
  });

  it('includes character fields in data rows', () => {
    const character: CharacterPreview = {
      ...toPreview(rick),
      location: {
        name: 'Citadel of Ricks',
        url: 'https://location.example',
      },
      image: 'https://example.com/rick.png',
    };

    const csv = generateCSV([character]);
    const [, row] = csv.split('\n');

    expect(row).toContain('1');
    expect(row).toContain('Rick Sanchez');
    expect(row).toContain('Alive');
    expect(row).toContain('Human');
    expect(row).toContain('Citadel of Ricks');
    expect(row).toContain('https://location.example');
    expect(row).toContain('https://example.com/rick.png');
  });

  it('generates one row per character', () => {
    const csv = generateCSV([toPreview(rick), toPreview(morty)]);

    expect(csv.split('\n')).toHaveLength(3);
    expect(csv).toContain('Rick Sanchez');
    expect(csv).toContain('Morty Smith');
  });

  it('escapes values containing commas, quotes, or newlines', () => {
    const character: CharacterPreview = {
      ...toPreview(rick),
      name: 'Rick "Pickle", Sanchez',
      species: 'Human, Alien',
    };

    const csv = generateCSV([character]);
    const [, row] = csv.split('\n');

    expect(row).toContain('"Rick ""Pickle"", Sanchez"');
    expect(row).toContain('"Human, Alien"');
  });
});
