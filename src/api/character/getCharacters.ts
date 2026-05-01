import type { CharactersResponse } from './getCharacters.type';

const API_BASE_URL = 'https://rickandmortyapi.com';

export const getCharacters = async (
  name?: string,
  page?: number
): Promise<CharactersResponse> => {
  const url = new URL('/api/character', API_BASE_URL);
  if (name) url.searchParams.append('name', name);
  if (page) url.searchParams.append('page', page.toString());

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`HTTP error! ${error}`);
  }
};
