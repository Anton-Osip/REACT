import { useState, useEffect, useCallback, type FC } from 'react';
import s from './character-list.module.css';
import clsx from 'clsx';
import { type CharactersResponse, getCharacters } from '../../api/character';
import { CharacterCard } from './character-card';
import { Button, Skeleton, Typography } from '../../components';
import emptyPageImage from '../../assets/image/emptyPageImage.png';
import errorPageImage from '../../assets/image/errorPageImage.png';

interface CharacterListProps {
  className?: string;
  searchName?: string;
}

const SKELETON_COUNT = 20;

export const CharacterList: FC<CharacterListProps> = ({
  className,
  searchName,
}) => {
  const [characters, setCharacters] = useState<CharactersResponse | null>(null);
  const [charactersIsLoading, setCharactersIsLoading] =
    useState<boolean>(false);
  const [charactersIsError, setCharactersIsError] = useState<Error | null>(
    null
  );
  const [shouldThrowError, setShouldThrowError] = useState<boolean>(false);

  const loadCharacters = useCallback(async (name?: string): Promise<void> => {
    setCharacters(null);
    setCharactersIsLoading(true);
    setCharactersIsError(null);

    try {
      const res = await getCharacters(name);
      setCharacters(res);
      setCharactersIsLoading(false);
    } catch (error) {
      setCharacters(null);
      setCharactersIsLoading(false);
      setCharactersIsError(
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }, []);

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

  const renderError = () => (
    <div className={s.error}>
      <div className={s.errorContent}>
        <Typography variant="h2" className={s.errorTitle}>
          Something went wrong
        </Typography>
        <img
          className={s.errorPageImage}
          src={errorPageImage}
          alt="error image"
        />
        <Typography variant="body2" className={s.errorMessage}>
          {charactersIsError?.message || 'An unexpected error occurred'}
        </Typography>
        <Button
          variant="secondary"
          onClick={() => loadCharacters(searchName)}
          className={s.resetButton}
          fullWidth
        >
          Try Again
        </Button>
      </div>
    </div>
  );

  const renderEmpty = () => (
    <div className={s.empty}>
      <img className={s.emptyImage} src={emptyPageImage} alt="empty page" />
      <Typography className={s.emptyText} variant={'h3'}>
        Nothing found.
      </Typography>
    </div>
  );

  const renderLoading = () => (
    <div className={s.grid}>
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <Skeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  const renderContent = () => (
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
  );

  return (
    <>
      {charactersIsError && renderError()}
      {characters?.results.length === 0 &&
        !charactersIsLoading &&
        renderEmpty()}
      {!characters && charactersIsLoading && renderLoading()}
      {characters?.results.length !== 0 && renderContent()}
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
