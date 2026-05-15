import { type JSX } from 'react';
import s from './character-page.module.css';
import { SearchForm } from '../../features/search-form';
import { CharacterList } from '../../features/character-list';

import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { saveToStorage } from '../../utils';
import { CharacterDetails } from '../../features/character-details';
import { Container } from '../../components';

const indexRoute = getRouteApi('/');

export const STORAGE_KEY = 'searchCharacterValue';

export function CharacterPage(): JSX.Element {
  const navigate = useNavigate({ from: '/' });
  const { page, search, details } = indexRoute.useSearch();

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
    <div className={s.characterPage}>
      <Container className={s.container}>
        <CharacterDetails detailsId={details} />
        <SearchForm
          submitInput={searchCharactersByName}
          defaultValue={search}
        />
        <CharacterList
          searchName={search}
          page={page}
          onPageChange={onPageChange}
        />
      </Container>
    </div>
  );
}
