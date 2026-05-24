import { HTTP_ERROR_MESSAGES, requestJson } from '@/shared/api';

import type {
  CharacterResponse,
  CharactersResponse,
} from './getCharacters.type.ts';

const API_BASE_URL = 'https://rickandmortyapi.com';

const EMPTY_CHARACTERS_RESPONSE: CharactersResponse = {
  info: {
    count: 0,
    pages: 0,
    next: null,
    prev: null,
  },
  results: [],
};

export const getCharacters = async (
  name?: string,
  page?: number
): Promise<CharactersResponse> => {
  const url = new URL('/api/character', API_BASE_URL);
  if (name) url.searchParams.append('name', name);
  if (page) url.searchParams.append('page', page.toString());

  return requestJson(url, () => EMPTY_CHARACTERS_RESPONSE);
};

export const getCharacterDetails = async (
  characterId: number
): Promise<CharacterResponse> => {
  const url = new URL(`/api/character/${characterId}`, API_BASE_URL);

  return requestJson(url, () => {
    throw new Error(HTTP_ERROR_MESSAGES.notFound);
  });
};
