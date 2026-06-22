'use server';

import { getLocale } from 'next-intl/server';

import { buildCharactersListHref, parseCharacterId } from '@/constants';
import { redirect } from '@/i18n';

export type SearchState = {
  error?: string;
};

export type SearchAction = (state: SearchState | null | undefined, payload: FormData) => Promise<SearchState | null>;

export const searchCharacters: SearchAction = async (_prevState, formData) => {
  const raw = formData.get('search');
  const search = typeof raw === 'string' ? raw.trim() : '';

  if (search === '' && raw !== '') {
    return { error: 'invalid' };
  }

  const characterId = parseCharacterId(formData.get('characterId'));
  const href = buildCharactersListHref({ search: search || undefined, page: 1 }, characterId);

  redirect({ href, locale: await getLocale() });

  return null;
};
