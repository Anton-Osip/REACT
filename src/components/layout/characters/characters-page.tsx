'use client';

import { type FC, useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Characters } from './characters';

import { loadFromStorage } from '@/utils';
import { CharactersFilter, STORAGE_KEY } from '@components/layout';
import { type CharactersResponse } from '@services/character';

type Props = {
  initialData: CharactersResponse;
};

export const CharactersPage: FC<Props> = ({ initialData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') ?? undefined;
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let shouldReplace = false;

    if (!searchParams.has('search')) {
      const saved = loadFromStorage<string>(STORAGE_KEY, '');

      if (saved) {
        params.set('search', saved);
        shouldReplace = true;
      }
    }

    if (!searchParams.has('page')) {
      params.set('page', '1');
      shouldReplace = true;
    }

    if (shouldReplace) {
      router.replace(`?${params.toString()}`);
    }
  }, [router, searchParams]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-6 pb-8">
      <CharactersFilter defaultValue={search} />
      <Characters page={page} name={search ?? ''} initialData={initialData} />
    </div>
  );
};
