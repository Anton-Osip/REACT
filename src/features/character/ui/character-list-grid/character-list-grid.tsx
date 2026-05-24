import { type FC } from 'react';

import clsx from 'clsx';

import type { CharacterPreview } from '@/features/character/api';
import { CharacterCard } from '@/features/character/ui/character-card';

import s from './character-list-grid.module.css';

type Props = {
  className?: string;
  characters: CharacterPreview[];
};

export const CharacterListGrid: FC<Props> = ({ className, characters }) => {
  if (characters.length === 0) return null;

  return (
    <div className={clsx(s.scroll, className)}>
      <div className={s.grid}>
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
};
