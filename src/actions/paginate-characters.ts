'use server';

import { getLocale } from 'next-intl/server';

import { buildCharactersListHref, parseCharacterId } from '@/constants';
import { redirect } from '@/i18n';

export type PaginateState = {
  error?: string;
};

export type PaginateAction = (
  state: PaginateState | null | undefined,
  payload: FormData,
) => Promise<PaginateState | null>;

export const paginateCharacters: PaginateAction = async (_prevState, formData) => {
  const pageRaw = formData.get('page');
  const page = typeof pageRaw === 'string' ? Number.parseInt(pageRaw, 10) : 1;

  if (!Number.isFinite(page) || page < 1) {
    return { error: 'invalid' };
  }

  const searchRaw = formData.get('search');
  const search = typeof searchRaw === 'string' ? searchRaw.trim() : '';

  const characterId = parseCharacterId(formData.get('characterId'));

  const href = buildCharactersListHref({ search: search || undefined, page }, characterId);

  redirect({ href, locale: await getLocale() });

  return null;
};
