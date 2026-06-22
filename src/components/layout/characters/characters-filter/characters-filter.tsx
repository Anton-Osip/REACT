'use client';

import { type FC, useActionState, useEffect, useState } from 'react';

import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { searchCharacters, type SearchState } from '@/actions/search-characters';
import { parseCharacterIdFromPathname } from '@/constants';
import { usePathname } from '@/i18n';
import { Button, TextField } from '@components/common';

export const STORAGE_KEY = 'characters-search';

type Props = {
  className?: string;
};

export const CharactersFilter: FC<Props> = ({ className }) => {
  const t = useTranslations('Characters');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get('search') ?? '';
  const characterId = parseCharacterIdFromPathname(pathname);

  const [, formAction, isPending] = useActionState<SearchState | null, FormData>(searchCharacters, null);
  const [value, setValue] = useState(searchFromUrl);

  useEffect(() => {
    setValue(searchFromUrl);
  }, [searchFromUrl]);

  return (
    <form className={clsx('grid w-full grid-cols-[1fr_103px] items-center gap-4', className)} action={formAction}>
      {characterId && <input type="hidden" name="characterId" value={characterId} />}
      <TextField
        name="search"
        placeholder={t('searchPlaceholder')}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <Button type="submit" disabled={isPending}>
        {t('search')}
      </Button>
    </form>
  );
};
