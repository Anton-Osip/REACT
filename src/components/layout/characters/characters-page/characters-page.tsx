import { Suspense, type FC } from 'react';

import { CharactersFilter } from '../characters-filter';
import { CharactersList } from '../characters-list';
import { CharactersListLoading } from '../characters-list-loading';

import { Skeleton } from '@components/common';

type Props = {
  searchParams: Promise<{ search?: string; page?: string }>;
};

const ListSlot: FC<Props> = async ({ searchParams }) => {
  const { search, page } = await searchParams;

  return <CharactersList search={search} page={page} />;
};

export const CharactersPage: FC<Props> = ({ searchParams }) => {
  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <Suspense fallback={<Skeleton className="max-h-[38px]" />}>
        <CharactersFilter />
      </Suspense>
      <div className="min-h-0 flex-1">
        <Suspense fallback={<CharactersListLoading />}>
          <ListSlot searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
};
