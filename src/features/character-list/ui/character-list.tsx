import { useEffect, type FC } from 'react';

import clsx from 'clsx';

import { Pagination } from '@/shared/ui';
import { EmptyComponent } from '@/widgets/empty';
import { ErrorComponent } from '@/widgets/error';

import { CharacterCard } from '../../character-card';
import { useCharacterListStore } from '../modal/character-list.state';

import { CharacterLoading } from './character-loading';

import s from './character-list.module.css';

interface CharacterListProps {
  className?: string;
  searchName?: string;
  page: number;
  onPageChange: (page: number) => void;
  selectCardId?: string;
}

export const CharacterList: FC<CharacterListProps> = ({
  className,
  searchName,
  page,
  onPageChange,
  selectCardId,
}) => {
  const {
    characters,
    charactersIsLoading,
    charactersIsError,
    fetchCharacters,
    toggleCharacterSelected,
    selectedCharacterIds,
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

      {characters && characters?.results.length !== 0 && (
        <>
          <div className={clsx(s.characterList, className)}>
            {characters && characters.results.length !== 0 && (
              <div className={clsx(s.grid, selectCardId && s.selectCardId)}>
                {characters.results.map((character) => (
                  <CharacterCard
                    key={character.id}
                    image={character.image}
                    name={character.name}
                    species={character.species}
                    location={character.location.name}
                    status={character.status}
                    id={character.id}
                    selectCardId={selectCardId}
                    isSelected={
                      selectedCharacterIds?.has(character.id) || false
                    }
                    toggleCharacterSelected={() =>
                      toggleCharacterSelected(character)
                    }
                  />
                ))}
              </div>
            )}
          </div>
          <Pagination
            pages={characters?.info.pages ?? 1}
            currentPage={page}
            onPageChange={(page: number) => {
              onPageChange(page);
            }}
          />
        </>
      )}
    </>
  );
};
