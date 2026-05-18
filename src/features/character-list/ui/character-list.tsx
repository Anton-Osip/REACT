import { useReducer, useEffect, useCallback, type FC } from 'react';
import s from './character-list.module.css';
import clsx from 'clsx';
import { getCharacters } from '../../../api/character';
import {
  CharacterListActionTypes,
  characterListReducer,
  initialState,
} from '../modal/character-list.state.ts';
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
  const [
    { characters, charactersIsLoading, charactersIsError, shouldThrowError },
    dispatch,
  ] = useReducer(characterListReducer, initialState);

  const loadCharacters = useCallback(
    async (name?: string): Promise<void> => {
      dispatch({ type: CharacterListActionTypes.LOAD_START });

      try {
        const res = await getCharacters(name, page);
        dispatch({
          type: CharacterListActionTypes.LOAD_SUCCESS,
          payload: res,
        });
      } catch (error) {
        dispatch({
          type: CharacterListActionTypes.LOAD_ERROR,
          payload: error instanceof Error ? error : new Error(String(error)),
        });
      }
    },
    [page]
  );

  const simulateError = useCallback((): void => {
    dispatch({ type: CharacterListActionTypes.SIMULATE_ERROR });
  }, []);

  useEffect(() => {
    void loadCharacters(searchName);
  }, [loadCharacters, searchName]);

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
        tryAgain={() => loadCharacters(searchName)}
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
