import { type FC, useCallback, useEffect, useReducer } from 'react';
import s from './character-details.module.css';
import clsx from 'clsx';
import {
  CharacterDetailsActionTypes,
  characterDetailsReducer,
  initialState,
} from '../modal/character-details.state.ts';
import { getCharacterDetails } from '../../../api/character';
import {
  Button,
  CrossIcon,
  ErrorComponent,
  Skeleton,
  Typography,
} from '../../../components';
import { getRouteApi, useNavigate } from '@tanstack/react-router';

interface CharacterDetailsProps {
  className?: string;
}
const indexRoute = getRouteApi('/character/$id');
export const CharacterDetails: FC<CharacterDetailsProps> = ({ className }) => {
  const navigate = useNavigate({ from: '/character' });

  const { id: details } = indexRoute.useParams();
  const [
    { characterDetails, charactersIsLoading, charactersIsError },
    dispatch,
  ] = useReducer(characterDetailsReducer, initialState);

  const loadCharacters = useCallback(
    async (detailsId: string): Promise<void> => {
      dispatch({ type: CharacterDetailsActionTypes.LOAD_START });

      try {
        const res = await getCharacterDetails(+detailsId);
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
    if (!details) return;
    void loadCharacters(details);
  }, [loadCharacters, details]);

  const closeDetails = () => {
    void navigate({
      to: '/character',
      search: (prev) => prev,
    });
  };

  if (details === undefined) return null;
  return (
    <>
      {charactersIsLoading && <Skeleton className={s.skeleton} />}

      <ErrorComponent
        isError={!!charactersIsError}
        errorText={charactersIsError?.message}
        tryAgain={() => loadCharacters(details)}
      />

      {characterDetails && (
        <div className={clsx(s.characterDetails, className)}>
          <Button
            variant={'primary'}
            className={s.closeBtn}
            onClick={closeDetails}
          >
            <CrossIcon />
          </Button>
          <div className={s.imageBox}>
            <img
              className={s.image}
              src={characterDetails.image}
              alt={characterDetails.name}
            />
          </div>
          <div className={s.info}>
            <Typography variant="h1" className={s.name}>
              {characterDetails.name}
            </Typography>
            <div className={s.items}>
              <div className={s.item}>
                <Typography variant="body1" className={s.title}>
                  gender
                </Typography>
                <Typography variant="h3" className={s.value}>
                  {characterDetails.gender}
                </Typography>
              </div>
              <div className={s.item}>
                <Typography variant="body1" className={s.title}>
                  location
                </Typography>
                <Typography variant="h3" className={s.value}>
                  {characterDetails.location.name}
                </Typography>
              </div>
              <div className={s.item}>
                <Typography variant="body1" className={s.title}>
                  species
                </Typography>
                <Typography variant="h3" className={s.value}>
                  {characterDetails.species}
                </Typography>
              </div>
              <div className={s.item}>
                <Typography variant="body1" className={s.title}>
                  status
                </Typography>
                <Typography variant="h3" className={s.value}>
                  {characterDetails.status}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
