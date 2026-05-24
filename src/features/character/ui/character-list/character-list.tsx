import { useEffect, type FC } from 'react';

import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';

import { Pagination } from '@/shared/ui';
import { EmptyComponent } from '@/widgets/empty';
import { ErrorComponent } from '@/widgets/error';

import { useCharacterListStore } from '../../model/character-list-state/character-list.state';
import { CharacterListGrid } from '../character-list-grid';
import { CharacterLoading } from '../character-loading';

import s from './character-list.module.css';

type Props = {
  className?: string;
  searchName?: string;
  page: number;
};

export const CharacterList: FC<Props> = ({ className, searchName, page }) => {
  const navigate = useNavigate({ from: '/character' });
  const {
    characters,
    charactersIsLoading,
    charactersIsError,
    fetchCharacters,
  } = useCharacterListStore();

  useEffect(() => {
    void fetchCharacters({ name: searchName, page });
  }, [fetchCharacters, searchName, page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchName]);

  return (
    <>
      <ErrorComponent
        isError={!!charactersIsError}
        errorText={charactersIsError?.message}
        tryAgain={() => void fetchCharacters({ name: searchName, page })}
      />

      <EmptyComponent
        isEmpty={characters?.results.length === 0 && !charactersIsLoading}
      />

      <CharacterLoading isLoading={!characters && charactersIsLoading} />

      {characters && characters.results.length !== 0 && (
        <div className={clsx(s.characterList, className)}>
          <CharacterListGrid characters={characters.results} />
          <Pagination
            className={s.pagination}
            pages={characters.info.pages ?? 1}
            currentPage={page}
            onPageChange={(nextPage: number) => {
              void navigate({
                search: (prev) => ({ ...prev, page: nextPage }),
              });
            }}
          />
        </div>
      )}
    </>
  );
};
