import type { FC } from 'react';

import { Characters } from '../characters';

import { getCharacters } from '@/services';

type Props = {
  search?: string;
  page?: string;
};

export const CharactersList: FC<Props> = async ({ search, page }) => {
  const currentPage = Number(page) || 1;
  const characters = await getCharacters({ search, page });

  return <Characters page={currentPage} characters={characters} />;
};
