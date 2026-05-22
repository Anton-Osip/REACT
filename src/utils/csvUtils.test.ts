import { describe, expect, it } from 'vitest';

import { createCharactersResponse } from '@/test-utils';

import type { Character } from '../api/character/getCharacters.type';

import { generateCSV } from './csvUtils';

describe('generateCSV', () => {
  const [rick, morty] = createCharactersResponse().results;

  it('includes header row with expected columns', () => {
    const csv = generateCSV([]);

    expect(csv.split('\n')[0]).toBe(
      'ID,Name,Status,Species,Type,Gender,Origin Name,Origin URL,Location Name,Location URL,Image URL,Episode Count,First Episode,Character URL,Created Date'
    );
  });

  it('returns only headers when items array is empty', () => {
    expect(generateCSV([])).not.toContain('\n\n');
    expect(generateCSV([]).split('\n')).toHaveLength(1);
  });

  it('includes character fields in data rows', () => {
    const character: Character = {
      ...rick,
      url: 'https://rickandmortyapi.com/api/character/1',
      origin: { name: 'Earth (C-137)', url: 'https://origin.example' },
      location: {
        name: 'Citadel of Ricks',
        url: 'https://location.example',
      },
      episode: ['https://episode.example/1'],
      created: '2017-11-04T18:48:46.250Z',
    };

    const csv = generateCSV([character]);
    const [, row] = csv.split('\n');

    expect(row).toContain('1');
    expect(row).toContain('Rick Sanchez');
    expect(row).toContain('Alive');
    expect(row).toContain('Human');
    expect(row).toContain('https://rickandmortyapi.com/api/character/1');
    expect(row).toContain('https://location.example');
    expect(row).toContain('https://example.com/rick.png');
    expect(row).toContain('2017-11-04T18:48:46.250Z');
  });

  it('generates one row per character', () => {
    const csv = generateCSV([rick, morty]);

    expect(csv.split('\n')).toHaveLength(3);
    expect(csv).toContain('Rick Sanchez');
    expect(csv).toContain('Morty Smith');
  });

  it('escapes values containing commas, quotes, or newlines', () => {
    const character: Character = {
      ...rick,
      name: 'Rick "Pickle", Sanchez',
      species: 'Human, Alien',
    };

    const csv = generateCSV([character]);
    const [, row] = csv.split('\n');

    expect(row).toContain('"Rick ""Pickle"", Sanchez"');
    expect(row).toContain('"Human, Alien"');
  });
});
