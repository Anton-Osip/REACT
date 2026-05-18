import { useEffect, type FC } from 'react';
import s from './character-list.module.css';
import clsx from 'clsx';
import { useCharacterListStore } from '../modal/character-list.state';
import { CharacterCard } from './character-card';
import {
  Button,
  EmptyComponent,
  ErrorComponent,
  Pagination,
} from '../../../components';
import { CharacterLoading } from './character-loading';

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
    shouldThrowError,
    fetchCharacters,
    simulateError,
  } = useCharacterListStore();

  useEffect(() => {
    void fetchCharacters({ name: searchName, page });
  }, [fetchCharacters, searchName, page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchName]);

  if (shouldThrowError) {
    throw new Error('Test error from Error Footer - Check console for details');
  }

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

      <Button
        variant={'secondary'}
        className={s.button}
        onClick={simulateError}
      >
        Error Button
      </Button>
    </>
  );
};
