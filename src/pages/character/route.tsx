import { type JSX } from 'react';
import s from './character-page.module.css';

import {
  createFileRoute,
  Outlet,
  useMatch,
  useNavigate,
} from '@tanstack/react-router';
import clsx from 'clsx';
import { loadFromStorage, saveToStorage } from '../../utils';
import { SearchForm } from '../../features/search-form';
import { CharacterList } from '../../features/character-list';
import { SelectedCharacters } from '../../features/selected-file/ui/selected-characters.tsx';

export const STORAGE_KEY = 'searchCharacterValue';

function readSearchFromUrl(raw: Record<string, unknown>): string | undefined {
  if (!('search' in raw)) return undefined;
  const v = raw.search;
  if (typeof v === 'string') return v;
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  if (Array.isArray(v)) {
    const first = v[0];
    if (first === undefined || first === null) return '';
    if (typeof first === 'string') return first;
    if (typeof first === 'number' && Number.isFinite(first))
      return String(first);
    return String(first);
  }
  if (v === undefined || v === null) return '';
  return String(v);
}

export const Route = createFileRoute('/character')({
  component: CharacterPage,
  validateSearch: (raw: Record<string, unknown>) => {
    const searchFromStorage = loadFromStorage<string>(STORAGE_KEY, '');
    const page = Number(raw.page);
    const urlSearch = readSearchFromUrl(raw);

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

function CharacterPage(): JSX.Element {
  const navigate = useNavigate({ from: '/character' });
  const idMatch = useMatch({ from: '/character/$id', shouldThrow: false });
  const selectCardId = idMatch?.params.id;
  const { page, search } = Route.useSearch();

  const searchCharactersByName = (value: string): void => {
    saveToStorage(STORAGE_KEY, value);
    void navigate({
      search: (prev) => ({ ...prev, page: 1, search: value }),
    });
  };

  const onPageChange = (nextPage: number) => {
    void navigate({
      search: (prev) => ({ ...prev, page: nextPage }),
    });
  };

  return (
    <div className={clsx(s.characterPage, selectCardId && s.showDetails)}>
      <section className={s.characterList}>
        <SearchForm
          submitInput={searchCharactersByName}
          defaultValue={search}
        />
        <CharacterList
          selectCardId={selectCardId}
          searchName={search}
          page={page}
          onPageChange={onPageChange}
        />
      </section>
      <Outlet />
      <SelectedCharacters />
    </div>
  );
}
