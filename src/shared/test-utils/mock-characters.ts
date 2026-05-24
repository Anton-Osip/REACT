import type { CharactersResponse } from '../../features/character/api';

const baseCharacter = {
  type: '',
  gender: 'Male' as const,
  origin: { name: 'Earth', url: '' },
  episode: [] as string[],
  url: '',
  created: '',
};

const defaultResults: CharactersResponse['results'] = [
  {
    ...baseCharacter,
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    location: { name: 'Citadel of Ricks', url: '' },
    image: 'https://example.com/rick.png',
  },
  {
    ...baseCharacter,
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    location: { name: 'Earth', url: '' },
    image: 'https://example.com/morty.png',
  },
];

export function createCharactersResponse(
  overrides: Partial<Pick<CharactersResponse, 'info' | 'results'>> = {}
): CharactersResponse {
  const results = overrides.results ?? defaultResults;
  const info =
    overrides.info ??
    ({
      count: results.length,
      pages: 1,
      next: null,
      prev: null,
    } satisfies CharactersResponse['info']);

  return { info, results };
}
