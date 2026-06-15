'use client';

import { type FC, useCallback, useLayoutEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { charactersApi, useGetCharactersQuery } from '@/services';
import { useAppDispatch } from '@/store';
import { toCharacterPreview } from '@/utils';
import { Button, Pagination, Skeleton } from '@components/common';
import { EmptyComponent, ErrorComponent } from '@components/layout';
import { CharactersList } from '@components/layout/characters/characters-list';
import type { CharactersResponse } from '@services/character';

const SKELETON_COUNT = 24;

type Props = {
  page: number;
  name: string;
  initialData: CharactersResponse;
};

export const Characters: FC<Props> = ({ page, name, initialData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [querySkip, setQuerySkip] = useState(Boolean(initialData));

  const { data, isLoading, isError, isFetching, refetch } = useGetCharactersQuery({ page, name }, { skip: querySkip });

  const renderCharacters = initialData || data;

  useLayoutEffect(() => {
    dispatch(charactersApi.util.upsertQueryData('getCharacters', { page, name: name ?? '' }, initialData));

    setQuerySkip(false);
  }, [dispatch, initialData, page, name]);

  const onPageChange = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams?.toString());

      params.set('page', String(nextPage));
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const charactersIsLoading = isFetching || isLoading;

  if (isError) {
    return <ErrorComponent tryAgain={refetch} />;
  }

  const characters = renderCharacters?.results.map(c => toCharacterPreview(c));
  const isListEmpty = characters?.length === 0 || characters === undefined;

  if (charactersIsLoading) {
    return (
      <div className="h-full min-h-0 overflow-y-auto">
        <div className="grid grid-cols-4 auto-rows-[436px] gap-4">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <Skeleton key={`skeleton-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  if (isListEmpty) {
    return <EmptyComponent />;
  }

  return (
    <>
      <div className="h-full min-h-0">
        <CharactersList characters={characters} />
      </div>
      <div className="flex items-center justify-between">
        <Pagination pages={renderCharacters?.info.pages ?? 1} currentPage={page} onPageChange={onPageChange} />
        <Button variant={'primary'} onClick={refetch}>
          Refresh characters
        </Button>
      </div>
    </>
  );
};
