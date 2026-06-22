'use client';

import { type FC, useActionState, useCallback } from 'react';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { paginateCharacters, type PaginateState } from '@/actions/paginate-characters';
import { parseCharacterIdFromPathname } from '@/constants';
import { usePathname, useRouter } from '@/i18n';
import type { CharactersResponse } from '@/services';
import { toCharacterPreview } from '@/utils';
import { Button, Pagination } from '@components/common';
import { EmptyComponent, CharactersCard } from '@components/layout';

type Props = {
  page?: number;
  characters: CharactersResponse;
};

const COUNT_PRIORITY_IMAGES = 4;

export const Characters: FC<Props> = ({ page = 1, characters }) => {
  const t = useTranslations('Characters');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const characterId = parseCharacterIdFromPathname(pathname);

  const [, paginateAction, isPaginating] = useActionState<PaginateState | null, FormData>(paginateCharacters, null);

  const refetch = useCallback(() => {
    router.refresh();
  }, [router]);

  const charactersToRender = characters?.results?.map(c => toCharacterPreview(c)) ?? [];
  const isListEmpty = charactersToRender.length === 0;

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
        <Pagination
          pages={characters?.info.pages ?? 1}
          currentPage={page}
          formAction={paginateAction}
          search={search}
          characterId={characterId}
          isPending={isPaginating}
        />
        <Button variant={'primary'} onClick={refetch}>
          {t('refresh')}
        </Button>
      </div>
    </div>
  );
};
