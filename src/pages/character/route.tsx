import { createFileRoute } from '@tanstack/react-router';

import { STORAGE_KEY } from '@/features/character/model/constants.ts';
import { CharacterPage } from '@/pages/character/-character-page.tsx';
import { loadFromStorage } from '@/shared/utils';

function resolveSearch(
  urlSearch: string | undefined,
  storageSearch: string
): string | undefined {
  if (urlSearch) return urlSearch;
  if (storageSearch) return storageSearch;
  return undefined;
}

export const Route = createFileRoute('/character')({
  component: CharacterPage,
  validateSearch: (raw: Record<string, string>) => {
    const searchFromStorage = loadFromStorage<string>(STORAGE_KEY, '');
    const page = Number(raw.page);

    return {
      search: resolveSearch(raw.search, searchFromStorage),
      page: Number.isFinite(page) && page > 0 ? page : 1,
    };
  },
});
