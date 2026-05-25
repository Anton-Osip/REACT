import { type FC } from 'react';

import { getRouteApi, useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';

import { useGetCharactersDetails } from '@/features/character/api';
import { Button, CrossIcon, Skeleton, Typography } from '@/shared/ui';
import { getQueryErrorMessage } from '@/shared/utils/get-query-error-message.ts';
import { ErrorComponent } from '@/widgets/error';

import s from './character-details.module.css';

type CharacterDetailsProps = {
  className?: string;
};

const indexRoute = getRouteApi('/character/$id');

export const CharacterDetails: FC<CharacterDetailsProps> = ({ className }) => {
  const navigate = useNavigate({ from: '/character' });

  const { id: details } = indexRoute.useParams();

  const {
    data: characterDetails,
    error,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetCharactersDetails({
    characterId: Number(details),
  });

  const charactersIsLoading = isLoading || isFetching;

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
        isError={isError}
        errorText={error ? getQueryErrorMessage(error) : undefined}
        tryAgain={refetch}
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
