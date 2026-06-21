import type { Character, CharactersResponse } from '@services/character/character.type';

type ArgsType = { page: string | string[] | undefined; search: string | string[] | undefined };

export const getCharacters = async ({ search, page }: ArgsType): Promise<CharactersResponse> => {
  const urlSearchParams = new URLSearchParams();

  const searchStr = Array.isArray(search) ? search[0] : search;
  const pageStr = Array.isArray(page) ? page[0] : page;

  if (searchStr) urlSearchParams.set('name', searchStr);
  if (pageStr) urlSearchParams.set('page', pageStr);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/character/?${urlSearchParams}`, {});

  return await res.json();
};

type CharacterByIdArgs = { id: string | string[] | undefined };

export const getCharacterById = async ({ id }: CharacterByIdArgs): Promise<Character> => {
  const idStr = Array.isArray(id) ? id[0] : id;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/character/${idStr}`, {});

  return await res.json();
};
