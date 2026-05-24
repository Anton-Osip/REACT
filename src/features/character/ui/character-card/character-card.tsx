import { memo, type MouseEvent } from 'react';

import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';

import type { CharacterPreview } from '@/features/character/api';
import { useCharacterListStore } from '@/features/character/model/character-list-state/character-list.state.ts';
import { Button, StarIcon, Typography } from '@/shared/ui';

import s from './character-card.module.css';

export type CharacterCardProps = {
  className?: string;
  character: CharacterPreview;
};

export const CharacterCard = memo(function CharacterCard({
  className,
  character,
}: CharacterCardProps) {
  const navigate = useNavigate({ from: '/character' });

  const onHandleClick = () => {
    void navigate({
      to: '/character/$id',
      params: { id: String(character.id) },
      search: (prev) => prev,
    });
  };

  const { selectedCharacters, toggleCharacterSelected } =
    useCharacterListStore();

  const onStarClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toggleCharacterSelected(character);
  };

  return (
    <div className={clsx(s.card, className)} onClick={onHandleClick}>
      <Button
        variant={'ghost'}
        className={clsx(
          s.stareBtn,
          selectedCharacters?.has(character.id) && s.isSelected
        )}
        onClick={onStarClick}
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
