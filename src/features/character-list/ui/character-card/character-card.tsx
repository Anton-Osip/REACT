import { memo } from 'react';

import s from './character-card.module.css';
import type { CharacterStatus } from '../../../../api/character';
import { Typography } from '../../../../components';
import { useNavigate } from '@tanstack/react-router';

export type CharacterCardProps = {
  className?: string;
  image: string;
  name: string;
  species: string;
  location: string;
  status: CharacterStatus;
  id: number;
};

export const CharacterCard = memo(function CharacterCard({
  image,
  name,
  status,
  species,
  location,
  id,
}: CharacterCardProps) {
  const navigate = useNavigate({ from: '/' });
  const onHandleClick = () => {
    void navigate({
      search: (prev) => ({ ...prev, details: id }),
    });
  };

  return (
    <div className={s.card} onClick={onHandleClick}>
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
