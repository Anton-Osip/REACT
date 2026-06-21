import type { FC } from 'react';

import { getCharacters } from '@/services';
import { Characters, CharactersFilter } from '@components/layout';

type Props = {
  searchParams: Promise<{ search?: string; page?: string }>;
};

export const CharactersPage: FC<Props> = async ({ searchParams }) => {
  const { search, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const characters = await getCharacters({ search, page });

  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <CharactersFilter defaultValue={search} />
      <div className="min-h-0 flex-1">
        <Characters page={currentPage} characters={characters} />
      </div>
    </div>
  );
};
