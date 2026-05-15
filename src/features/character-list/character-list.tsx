import { useState, useEffect, useCallback, type FC } from 'react';
import s from './character-list.module.css';
import clsx from 'clsx';
import { type CharactersResponse, getCharacters } from '../../api/character';
import { CharacterCard } from './character-card';
import {
  Button,
  EmptyComponent,
  ErrorComponent,
  Pagination,
  Skeleton,
} from '../../components';

interface CharacterListProps {
  className?: string;
  searchName?: string;
  page: number;
  onPageChange: (page: number) => void;
}

const SKELETON_COUNT = 20;

export const CharacterList: FC<CharacterListProps> = ({
  className,
  searchName,
  page,
  onPageChange,
}) => {
  const [characters, setCharacters] = useState<CharactersResponse | null>(null);
  const [charactersIsLoading, setCharactersIsLoading] =
    useState<boolean>(false);
  const [charactersIsError, setCharactersIsError] = useState<Error | null>(
    null
  );
  const [shouldThrowError, setShouldThrowError] = useState<boolean>(false);

  const loadCharacters = useCallback(
    async (name?: string): Promise<void> => {
      setCharacters(null);
      setCharactersIsLoading(true);
      setCharactersIsError(null);

      try {
        const res = await getCharacters(name, page);
        setCharacters(res);
        setCharactersIsLoading(false);
      } catch (error) {
        setCharacters(null);
        setCharactersIsLoading(false);
        setCharactersIsError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    },
    [page]
  );

  const simulateError = useCallback((): void => {
    setShouldThrowError(true);
  }, []);

  useEffect(() => {
    void loadCharacters(searchName);
  }, [loadCharacters, searchName]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchName]);

  if (shouldThrowError) {
    throw new Error('Test error from Error Button - Check console for details');
  }

  const renderLoading = () => (
    <div className={s.characterList}>
      <div className={s.grid}>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <Skeleton key={`skeleton-${index}`} />
        ))}
      </div>
    </div>
  );

  const renderContent = () => (
    <>
      <div className={clsx(s.characterList, className)}>
        {characters && characters.results.length !== 0 && (
          <div className={s.grid}>
            {characters.results.map((character) => (
              <CharacterCard
                key={character.id}
                image={character.image}
                name={character.name}
                species={character.species}
                location={character.location.name}
                status={character.status}
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
  );

  return (
    <>
      <ErrorComponent
        isError={Boolean(charactersIsError)}
        errorText={charactersIsError?.message}
        tryAgain={() => loadCharacters(searchName)}
      />

      <EmptyComponent
        isEmpty={characters?.results.length === 0 && !charactersIsLoading}
      />

      {!characters && charactersIsLoading && renderLoading()}
      {characters && characters?.results.length !== 0 && renderContent()}
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
