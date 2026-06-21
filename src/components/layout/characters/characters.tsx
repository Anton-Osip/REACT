'use client';

import { type FC, useCallback } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { toCharacterPreview } from '@/utils';
import { Button, Pagination } from '@components/common';
import { EmptyComponent } from '@components/layout';
import { CharactersCard } from '@components/layout/characters/characters-card';
import type { CharactersResponse } from '@services/character';

type Props = {
  page?: number;
  characters: CharactersResponse;
};

const COUNT_PRIORITY_IMAGES = 4;

export const Characters: FC<Props> = ({ page = 1, characters }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onPageChange = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams?.toString());

      params.set('page', String(nextPage));
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const refetch = useCallback(() => {
    router.refresh();
  }, [router]);

  const charactersToRender = characters?.results.map(c => toCharacterPreview(c));
  const isListEmpty = charactersToRender?.length === 0 || characters === undefined;

  if (isListEmpty) {
    return <EmptyComponent />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4" onClick={() => {}}>
          {charactersToRender.map((character, index) => (
            <CharactersCard character={character} key={character.id} priority={index < COUNT_PRIORITY_IMAGES} />
          ))}
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between">
        <Pagination pages={characters?.info.pages ?? 1} currentPage={page} onPageChange={onPageChange} />
        <Button variant={'primary'} onClick={refetch}>
          Refresh characters
        </Button>
      </div>
    </div>
  );
};
