import { type FC, useCallback, useEffect, useReducer } from 'react';
import s from './character-details.module.css';
import clsx from 'clsx';
import {
  CharacterDetailsActionTypes,
  characterDetailsReducer,
  initialState,
} from '../modal/character-details.state.ts';
import { getCharacterDetails } from '../../../api/character';
import { ErrorComponent, Skeleton, Typography } from '../../../components';

interface CharacterDetailsProps {
  className?: string;
  detailsId?: number;
}

export const CharacterDetails: FC<CharacterDetailsProps> = ({
  className,
  detailsId,
}) => {
  const [
    { characterDetails, charactersIsLoading, charactersIsError },
    dispatch,
  ] = useReducer(characterDetailsReducer, initialState);

  const loadCharacters = useCallback(
    async (detailsId: number): Promise<void> => {
      dispatch({ type: CharacterDetailsActionTypes.LOAD_START });

      try {
        const res = await getCharacterDetails(detailsId);
        dispatch({
          type: CharacterDetailsActionTypes.LOAD_SUCCESS,
          payload: res,
        });
      } catch (error) {
        dispatch({
          type: CharacterDetailsActionTypes.LOAD_ERROR,
          payload: error instanceof Error ? error : new Error(String(error)),
        });
      }
    },
    []
  );

  useEffect(() => {
    if (!detailsId) return;
    void loadCharacters(detailsId);
  }, [loadCharacters, detailsId]);

  if (detailsId === undefined) return null;
  return (
    <>
      {charactersIsLoading && <Skeleton className={s.skeleton} />}

      <ErrorComponent
        isError={!!charactersIsError}
        errorText={charactersIsError?.message}
        tryAgain={() => loadCharacters(detailsId)}
      />

      {characterDetails && (
        <div className={clsx(s.characterDetails, className)}>
          <div className={s.imageBox}>
            <img
              className={s.image}
              src={characterDetails.image}
              alt={characterDetails.name}
            />
          </div>
          <div className={s.info}>
            <Typography variant="h1">{characterDetails.name}</Typography>
            <div className={s.items}>
              <div className={s.item}>
                <Typography variant="caption" className={s.title}>
                  gender
                </Typography>
                <Typography variant="h4">{characterDetails.gender}</Typography>
              </div>
              <div className={s.item}>
                <Typography variant="caption" className={s.title}>
                  location
                </Typography>
                <Typography variant="h4">
                  {characterDetails.location.name}
                </Typography>
              </div>
              <div className={s.item}>
                <Typography variant="caption" className={s.title}>
                  species
                </Typography>
                <Typography variant="h4">{characterDetails.species}</Typography>
              </div>
              <div className={s.item}>
                <Typography variant="caption" className={s.title}>
                  status
                </Typography>
                <Typography variant="h4">{characterDetails.status}</Typography>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
