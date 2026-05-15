import type {
  CharacterResponse,
  CharactersResponse,
} from './getCharacters.type';

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

    if (response.status === 404) {
      return {
        info: {
          count: 0,
          pages: 0,
          next: null,
          prev: null,
        },
        results: [],
      };
    }

    if (response.status === 400) {
      throw new Error('400: Bad Request - Invalid search parameters');
    }

    if (response.status === 429) {
      throw new Error(
        "You're sending too many requests too quickly. Please wait a moment and try again. Thank you for your patience!;"
      );
    }

    if (response.status === 500) {
      throw new Error('500: Internal Server Error - Server is having issues');
    }

    if (!response.ok) {
      throw new Error(
        `${response.status}: ${response.statusText || 'Request failed'}`
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error(`HTTP error! ${error}`);
  }
};

export const getCharacterDetails = async (
  characterId: number
): Promise<CharacterResponse> => {
  try {
    const url = new URL(`/api/character/${characterId}`, API_BASE_URL);
    const response = await fetch(url);
    if (response.status === 404) {
      throw new Error('404: Bad Request - Invalid search parameters');
    }

    if (response.status === 400) {
      throw new Error('400: Bad Request - Invalid search parameters');
    }

    if (response.status === 429) {
      throw new Error(
        "You're sending too many requests too quickly. Please wait a moment and try again. Thank you for your patience!;"
      );
    }

    if (response.status === 500) {
      throw new Error('500: Internal Server Error - Server is having issues');
    }

    if (!response.ok) {
      throw new Error(
        `${response.status}: ${response.statusText || 'Request failed'}`
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error(`HTTP error! ${error}`);
  }
};
