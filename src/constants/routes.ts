export const ROUTES = {
  CHARACTERS: '/',
  ABOUT: '/about',
} as const;

export const getCharacterRoute = (id: string | number, query?: string): string => `/${id}${query ? `?${query}` : ''}`;
