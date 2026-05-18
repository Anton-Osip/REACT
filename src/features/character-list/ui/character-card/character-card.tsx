import { memo, useMemo } from 'react';

import s from './character-card.module.css';
import type { CharacterStatus } from '../../../../api/character';
import { Typography } from '../../../../components';
import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';

export type CharacterCardProps = {
  className?: string;
  image: string;
  name: string;
  species: string;
  location: string;
  status: CharacterStatus;
  id: number;
  selectCardId?: string;
};

export const CharacterCard = memo(function CharacterCard({
  image,
  name,
  status,
  species,
  location,
  id,
  selectCardId,
}: CharacterCardProps) {
  const navigate = useNavigate({ from: '/character' });
  const onHandleClick = () => {
    void navigate({
      to: '/character/$id',
      params: { id: String(id) },
      search: (prev) => prev,
    });
  };

  const cardIsSelected = useMemo(() => {
    if (selectCardId) {
      return id === Number(selectCardId);
    }
  }, [id, selectCardId]);

  return (
    <div
      className={clsx(s.card, cardIsSelected && s.selectedCard)}
      onClick={onHandleClick}
    >
      <div className={s.imageWrapper}>
        <img className={s.image} src={image} alt={name} />
      </div>
      <div className={s.content}>
        <div>
          <Typography className={s.text} variant="h2">
            {name}
          </Typography>
          <Typography className={s.text} variant="body2">
            {status} - {species}
          </Typography>
        </div>
        <div>
          <Typography className={s.text} variant="caption">
            Last known location:
          </Typography>
          <Typography className={s.text} variant="overline">
            {location}
          </Typography>
        </div>
      </div>
    </div>
  );
});
