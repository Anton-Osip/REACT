import { memo } from 'react';

import clsx from 'clsx';

import type { CharacterPreview } from '@/features/character/api';
import { Button, StarIcon, Typography } from '@/shared/ui';

import s from './character-card.module.css';

export type CharacterCardProps = {
  className?: string;
  character: CharacterPreview;
  isSelected?: boolean;
};

export const CharacterCard = memo(function CharacterCard({
  className,
  character,
  isSelected = false,
}: CharacterCardProps) {
  return (
    <div className={clsx(s.card, className)} data-card-id={character.id}>
      <Button
        variant={'ghost'}
        data-action="favorite"
        className={clsx(s.stareBtn, isSelected && s.isSelected)}
      >
        <StarIcon />
      </Button>
      <div className={s.imageWrapper}>
        <img className={s.image} src={character.image} alt={character.name} />
      </div>
      <div className={s.content}>
        <div>
          <Typography className={s.text} variant="h2">
            {character.name}
          </Typography>
          <Typography className={s.text} variant="body2">
            {character.status} - {character.species}
          </Typography>
        </div>
        <div>
          <Typography className={s.text} variant="caption">
            Last known location:
          </Typography>
          <Typography className={s.text} variant="overline">
            {character.location.name}
          </Typography>
        </div>
      </div>
    </div>
  );
});
