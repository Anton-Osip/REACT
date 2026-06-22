export const ROUTES = {
  CHARACTERS: '/',
  ABOUT: '/about',
} as const;

export const getCharacterRoute = (id: string | number, query?: string): string => `/${id}${query ? `?${query}` : ''}`;

const CHARACTER_PATH_PATTERN = /^\/(\d+)$/;

export const parseCharacterIdFromPathname = (pathname: string): string | null => {
  const match = pathname.match(CHARACTER_PATH_PATTERN);

  return match?.[1] ?? null;
};

export const parseCharacterId = (value: FormDataEntryValue | null): string | null => {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    return null;
  }

  return value;
};

type CharactersListQuery = {
  search?: string;
  page: number;
};

export const buildCharactersListHref = (query: CharactersListQuery, characterId: string | null = null): string => {
  const params = new URLSearchParams();

  if (query.search) {
    params.set('search', query.search);
  }

  params.set('page', String(query.page));

  const queryString = params.toString();

  if (characterId) {
    return getCharacterRoute(characterId, queryString);
  }

  return queryString ? `${ROUTES.CHARACTERS}?${queryString}` : ROUTES.CHARACTERS;
};
