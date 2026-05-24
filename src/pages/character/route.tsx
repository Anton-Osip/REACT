import { createFileRoute } from '@tanstack/react-router';

import { CharacterPage } from '@/pages/character/-character-page.tsx';
import { loadFromStorage } from '@/shared/utils';

export const STORAGE_KEY = 'searchCharacterValue';

export const Route = createFileRoute('/character')({
  component: CharacterPage,
  validateSearch: (raw: Record<string, string>) => {
    const searchFromStorage = loadFromStorage<string>(STORAGE_KEY, '');
    const page = Number(raw.page);
    const urlSearch = raw.search;

    return {
      search:
        urlSearch !== undefined && urlSearch !== ''
          ? urlSearch
          : searchFromStorage !== undefined && searchFromStorage !== ''
            ? searchFromStorage
            : undefined,
      page: Number.isFinite(page) && page > 0 ? page : 1,
    };
  },
});
