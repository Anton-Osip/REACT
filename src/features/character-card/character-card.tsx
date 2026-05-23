import { memo, type MouseEvent, useMemo } from 'react';

import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';

import type { CharacterStatus } from '@/api/character';
import { Button, StarIcon, Typography } from '@/shared/ui';

import s from './character-card.module.css';

export type CharacterCardProps = {
  className?: string;
  image: string;
  name: string;
  species: string;
  location: string;
  status: CharacterStatus;
  id: number;
  selectCardId?: string;
  isSelected: boolean;
  toggleCharacterSelected: () => void;
};

export const CharacterCard = memo(function CharacterCard({
  className,
  image,
  name,
  status,
  species,
  location,
  id,
  isSelected,
  selectCardId,
  toggleCharacterSelected,
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

  const toggleCharacter = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleCharacterSelected();
  };

  return (
    <div
      className={clsx(s.card, cardIsSelected && s.selectedCard, className)}
      onClick={onHandleClick}
    >
      <Button
        variant={'ghost'}
        className={clsx(s.stareBtn, isSelected && s.isSelected)}
        onClick={toggleCharacter}
      >
        <StarIcon />
      </Button>
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
